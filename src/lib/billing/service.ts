import { prisma } from "@/lib/prisma";
import {
  CREDIT_COST_CATALOG,
  getPlanByCode,
  PLAN_CATALOG,
  type BillingCycle,
} from "@/lib/billing/catalog";

const FALLBACK_PLAN_CODE = "free";
const FALLBACK_CREDIT_BALANCE = getPlanByCode(FALLBACK_PLAN_CODE).monthlyCredits;

function addMonths(base: Date, months: number) {
  const next = new Date(base);
  next.setMonth(next.getMonth() + months);
  return next;
}

function buildReferenceCode(prefix: string) {
  return `${prefix}_${Date.now()}`;
}

function isBillingInfraError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("no such table") ||
    message.includes("UserBillingProfile") ||
    message.includes("CreditTransaction")
  );
}

function buildFallbackBillingProfile(userId: string) {
  const now = new Date();
  return {
    id: `fallback_${userId}`,
    userId,
    planCode: FALLBACK_PLAN_CODE,
    billingCycle: "yearly",
    creditBalance: FALLBACK_CREDIT_BALANCE,
    periodStartedAt: now,
    periodEndsAt: null,
    createdAt: now,
    updatedAt: now,
  };
}

export async function ensureBillingProfile(userId: string) {
  const existing = await prisma.userBillingProfile.findUnique({
    where: { userId },
  });

  if (existing) {
    return existing;
  }

  const starterPlan = getPlanByCode("free");
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const profile = await tx.userBillingProfile.create({
      data: {
        userId,
        planCode: starterPlan.code,
        billingCycle: "yearly",
        creditBalance: starterPlan.monthlyCredits,
        periodStartedAt: now,
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        type: "grant",
        amount: starterPlan.monthlyCredits,
        balanceAfter: starterPlan.monthlyCredits,
        description: "新用户注册赠送积分",
        referenceCode: buildReferenceCode("welcome"),
      },
    });

    return profile;
  });
}

export async function getBillingOverviewForUser(userId: string) {
  try {
    const profile = await ensureBillingProfile(userId);
    const plan = getPlanByCode(profile.planCode);
    const recentTransactions = await prisma.creditTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    });

    return {
      summary: {
        planCode: profile.planCode,
        planName: plan.name,
        billingCycle: profile.billingCycle as BillingCycle,
        creditBalance: profile.creditBalance,
        monthlyCredits: plan.monthlyCredits,
        periodStartedAt: profile.periodStartedAt,
        periodEndsAt: profile.periodEndsAt,
      },
      plans: PLAN_CATALOG.map((item) => ({
        ...item,
        isCurrent: item.code === profile.planCode,
      })),
      creditCosts: CREDIT_COST_CATALOG,
      recentTransactions: recentTransactions.map((item) => ({
        id: item.id,
        type: item.type,
        amount: item.amount,
        balanceAfter: item.balanceAfter,
        description: item.description,
        referenceCode: item.referenceCode,
        createdAt: item.createdAt,
      })),
    };
  } catch (error) {
    if (!isBillingInfraError(error)) {
      throw error;
    }

    const fallbackProfile = buildFallbackBillingProfile(userId);
    const fallbackPlan = getPlanByCode(fallbackProfile.planCode);

    console.error("[billing] fallback billing overview", error);

    return {
      summary: {
        planCode: fallbackProfile.planCode,
        planName: fallbackPlan.name,
        billingCycle: fallbackProfile.billingCycle as BillingCycle,
        creditBalance: fallbackProfile.creditBalance,
        monthlyCredits: fallbackPlan.monthlyCredits,
        periodStartedAt: fallbackProfile.periodStartedAt,
        periodEndsAt: fallbackProfile.periodEndsAt,
      },
      plans: PLAN_CATALOG.map((item) => ({
        ...item,
        isCurrent: item.code === fallbackProfile.planCode,
      })),
      creditCosts: CREDIT_COST_CATALOG,
      recentTransactions: [],
    };
  }
}

export async function getCreditBadgeLabelForUser(userId: string) {
  try {
    const profile = await ensureBillingProfile(userId);
    return `${profile.creditBalance} 积分`;
  } catch (error) {
    if (!isBillingInfraError(error)) {
      throw error;
    }

    console.error("[billing] fallback credit badge", error);
    return `${FALLBACK_CREDIT_BALANCE} 积分`;
  }
}

export async function changeSubscriptionForUser(
  userId: string,
  planCode: string,
  billingCycle: BillingCycle,
) {
  const plan = getPlanByCode(planCode);
  const profile = await ensureBillingProfile(userId);
  const now = new Date();
  const periodEndsAt = billingCycle === "yearly" ? addMonths(now, 12) : addMonths(now, 1);
  const grantAmount = Math.max(0, plan.monthlyCredits - (profile.planCode === plan.code ? 0 : 0));

  return prisma.$transaction(async (tx) => {
    const updatedProfile = await tx.userBillingProfile.update({
      where: { userId },
      data: {
        planCode: plan.code,
        billingCycle,
        creditBalance: {
          increment: grantAmount,
        },
        periodStartedAt: now,
        periodEndsAt,
      },
    });

    if (grantAmount > 0) {
      await tx.creditTransaction.create({
        data: {
          userId,
          type: "grant",
          amount: grantAmount,
          balanceAfter: updatedProfile.creditBalance,
          description: `${plan.name} 开通成功，发放本期积分`,
          referenceCode: buildReferenceCode(`plan_${plan.code}`),
        },
      });
    }

    return updatedProfile;
  });
}

export async function purchaseCreditPackForUser(userId: string, packCode: string) {
  const packs = {
    starter: { credits: 30, priceLabel: "¥12" },
    creator: { credits: 80, priceLabel: "¥28" },
    studio: { credits: 200, priceLabel: "¥60" },
  } as const;

  const pack = packs[packCode as keyof typeof packs];

  if (!pack) {
    throw new Error("INVALID_CREDIT_PACK");
  }

  await ensureBillingProfile(userId);

  return prisma.$transaction(async (tx) => {
    const profile = await tx.userBillingProfile.update({
      where: { userId },
      data: {
        creditBalance: {
          increment: pack.credits,
        },
      },
    });

    await tx.creditTransaction.create({
      data: {
        userId,
        type: "purchase",
        amount: pack.credits,
        balanceAfter: profile.creditBalance,
        description: `购买积分包 ${pack.credits} 积分 (${pack.priceLabel})`,
        referenceCode: buildReferenceCode(`pack_${packCode}`),
      },
    });

    return {
      packCode,
      ...pack,
      balanceAfter: profile.creditBalance,
    };
  });
}
