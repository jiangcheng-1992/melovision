"use client";

import { CheckCircle2, Coins, LoaderCircle, ReceiptText, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { BillingCycle, PlanCatalogItem } from "@/lib/billing/catalog";
import { DebugLink } from "@/components/debug/navigation-debug";
import { InteractiveButton } from "@/components/debug/interactive-button";

type CreditCost = {
  action: string;
  cost: number;
  free?: boolean;
};

type BillingSummary = {
  planCode: string;
  planName: string;
  billingCycle: BillingCycle;
  creditBalance: number;
  monthlyCredits: number;
  periodStartedAt: string;
  periodEndsAt: string | null;
};

type RecentTransaction = {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  referenceCode: string | null;
  createdAt: string;
};

type PricingState = {
  authenticated: boolean;
  plans: Array<PlanCatalogItem & { isCurrent?: boolean }>;
  creditCosts: CreditCost[];
  recentTransactions: RecentTransaction[];
  summary: BillingSummary | null;
};

const CREDIT_PACKS = [
  { code: "starter", name: "入门补充包", credits: 30, priceLabel: "¥12" },
  { code: "creator", name: "创作加油包", credits: 80, priceLabel: "¥28" },
  { code: "studio", name: "工作室补给包", credits: 200, priceLabel: "¥60" },
] as const;

function formatPrice(value: number) {
  return value <= 0 ? "¥0" : `¥${value}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "长期有效";
  }

  return new Date(value).toLocaleDateString();
}

function FeatureItem({
  enabled,
  label,
  emphasis = false,
}: {
  enabled: boolean;
  label: string;
  emphasis?: boolean;
}) {
  if (enabled) {
    return (
      <li
        className={`flex items-start gap-3 text-sm ${
          emphasis ? "text-[#e5e0f3]" : "text-[#ccc3d8]"
        }`}
      >
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#4cd7f6]" />
        <span>{label}</span>
      </li>
    );
  }

  return (
    <li className="flex items-start gap-3 text-sm text-[#958da1]/50">
      <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#958da1]" />
      <span>{label}</span>
    </li>
  );
}

export function PricingBillingToggle({
  initialState,
}: {
  initialState: PricingState;
}) {
  const [state, setState] = useState(initialState);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    initialState.summary?.billingCycle ?? "yearly",
  );
  const [pendingPlanCode, setPendingPlanCode] = useState<string | null>(null);
  const [pendingPackCode, setPendingPackCode] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    console.groupCollapsed(`[pricing-billing-state] ${billingCycle}`);
    console.log("pricing-billing-state-change", {
      billingCycle,
      timestamp: new Date().toISOString(),
      performanceNow: Number(window.performance.now().toFixed(2)),
    });
    console.groupEnd();
  }, [billingCycle]);

  const displayPlans = useMemo(() => {
    return state.plans.map((plan) => {
      const displayPrice =
        plan.code === "free"
          ? formatPrice(0)
          : formatPrice(
              billingCycle === "yearly"
                ? plan.yearlyPriceMonthlyEquivalentCny
                : plan.monthlyPriceCny,
            );
      const displayUnit =
        plan.code === "free"
          ? "/永久免费"
          : billingCycle === "yearly"
            ? "/月 (按年计费)"
            : "/月 (按月计费)";

      return { ...plan, displayPrice, displayUnit };
    });
  }, [billingCycle, state.plans]);

  async function handleSubscribe(planCode: string) {
    if (!state.authenticated) {
      window.location.href = "/interfaces/login?redirect=/interfaces/pricing";
      return;
    }

    setPendingPlanCode(planCode);
    setActionError(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch("/api/billing/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planCode, billingCycle }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "SUBSCRIPTION_UPDATE_FAILED");
      }

      setState({
        authenticated: true,
        plans: payload.plans,
        creditCosts: payload.creditCosts,
        recentTransactions: payload.recentTransactions,
        summary: {
          ...payload.summary,
          periodStartedAt: payload.summary.periodStartedAt,
          periodEndsAt: payload.summary.periodEndsAt,
        },
      });
      setFeedbackMessage(payload.message || "套餐已更新");
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "套餐更新失败");
    } finally {
      setPendingPlanCode(null);
    }
  }

  async function handlePurchaseCredits(packCode: (typeof CREDIT_PACKS)[number]["code"]) {
    if (!state.authenticated) {
      window.location.href = "/interfaces/login?redirect=/interfaces/pricing";
      return;
    }

    setPendingPackCode(packCode);
    setActionError(null);
    setFeedbackMessage(null);

    try {
      const response = await fetch("/api/billing/credits/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packCode }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "CREDIT_PURCHASE_FAILED");
      }

      setState({
        authenticated: true,
        plans: payload.plans,
        creditCosts: payload.creditCosts,
        recentTransactions: payload.recentTransactions,
        summary: {
          ...payload.summary,
          periodStartedAt: payload.summary.periodStartedAt,
          periodEndsAt: payload.summary.periodEndsAt,
        },
      });
      setFeedbackMessage(
        payload.message ||
          `已到账 ${payload.purchase?.credits ?? ""} 积分`,
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "积分购买失败");
    } finally {
      setPendingPackCode(null);
    }
  }

  return (
    <>
      <div className="inline-flex items-center justify-center gap-4 rounded-full border border-[#4a4455]/20 bg-[#0e0c19] p-1.5 shadow-[0_0_30px_rgba(124,58,237,0.05)]">
        <InteractiveButton
          type="button"
          actionId="pricing-billing-monthly"
          sourcePage="pricing"
          onClick={() => {
            console.log("pricing-billing-click", {
              targetCycle: "monthly",
              previousCycle: billingCycle,
              timestamp: new Date().toISOString(),
            });
            setBillingCycle("monthly");
          }}
          className={`px-6 py-2 font-medium transition-colors ${
            billingCycle === "monthly"
              ? "rounded-full bg-[#2b2836] text-[#e5e0f3] shadow-sm"
              : "text-[#ccc3d8] hover:text-[#e5e0f3]"
          }`}
        >
          按月支付
        </InteractiveButton>
        <InteractiveButton
          type="button"
          actionId="pricing-billing-yearly"
          sourcePage="pricing"
          onClick={() => {
            console.log("pricing-billing-click", {
              targetCycle: "yearly",
              previousCycle: billingCycle,
              timestamp: new Date().toISOString(),
            });
            setBillingCycle("yearly");
          }}
          className={`flex items-center gap-2 px-6 py-2 font-medium transition-colors ${
            billingCycle === "yearly"
              ? "rounded-full bg-[#2b2836] text-[#e5e0f3] shadow-sm"
              : "text-[#ccc3d8] hover:text-[#e5e0f3]"
          }`}
        >
          按年支付
          <span className="rounded-full bg-[#4cd7f6]/10 px-2 py-0.5 text-xs text-[#4cd7f6]">
            立省 20%
          </span>
        </InteractiveButton>
      </div>

      <p className="mt-4 text-sm text-[#958da1]">
        当前计费方式：
        <span className="ml-1 text-[#d2bbff]">
          {billingCycle === "yearly" ? "年付折算" : "月付"}
        </span>
      </p>

      {state.summary ? (
        <div className="mb-10 mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#4cd7f6]/20 bg-[#1c1a27] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
            <div className="mb-2 flex items-center gap-2 text-sm text-[#4cd7f6]">
              <Coins className="h-4 w-4" />
              当前积分
            </div>
            <div className="text-3xl font-bold text-white">
              {state.summary.creditBalance}
            </div>
            <p className="mt-2 text-xs text-[#ccc3d8]">
              当前套餐：{state.summary.planName}，本期包含 {state.summary.monthlyCredits} 积分
            </p>
          </div>
          <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-5">
            <div className="mb-2 text-sm text-[#d2bbff]">计费周期</div>
            <div className="text-xl font-semibold text-white">
              {state.summary.billingCycle === "yearly" ? "年付折算" : "月付"}
            </div>
            <p className="mt-2 text-xs text-[#ccc3d8]">
              开始时间：{formatDate(state.summary.periodStartedAt)}
            </p>
          </div>
          <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-5">
            <div className="mb-2 text-sm text-[#d2bbff]">下次结算</div>
            <div className="text-xl font-semibold text-white">
              {formatDate(state.summary.periodEndsAt)}
            </div>
            <p className="mt-2 text-xs text-[#ccc3d8]">
              购买积分包后将立即增加余额
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-10 mt-8 rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-5 text-sm text-[#ccc3d8]">
          登录后可查看真实积分余额、当前套餐和最近充值记录。
        </div>
      )}

      {feedbackMessage ? (
        <div className="mb-6 rounded-2xl border border-[#4cd7f6]/20 bg-[#062230] px-4 py-3 text-sm text-[#b6eeff]">
          {feedbackMessage}
        </div>
      ) : null}

      {actionError ? (
        <div className="mb-6 rounded-2xl border border-[#ffb4ab]/20 bg-[#93000a]/10 px-4 py-3 text-sm text-[#ffd7d1]">
          {actionError}
        </div>
      ) : null}

      <div className="mb-16 grid items-stretch gap-8 md:grid-cols-3">
        {displayPlans.map((plan) => (
          <div
            key={plan.code}
            className={
              plan.featured
                ? "relative flex flex-col rounded-2xl border border-[#d2bbff]/50 bg-[#363342]/60 p-8 shadow-[0_0_40px_rgba(124,58,237,0.15)] backdrop-blur-[16px] md:-translate-y-4"
                : "flex flex-col rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-8 transition-colors duration-300 hover:bg-[#1c1a27]"
            }
          >
            {plan.featured ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6] px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0e0c19]">
                最受欢迎
              </div>
            ) : null}

            <h3 className={`mb-2 text-2xl font-bold ${plan.titleClass}`}>
              {plan.name}
            </h3>
            <div className="mb-6 text-sm text-[#ccc3d8]">{plan.subtitle}</div>
            <div className="mb-8 flex items-baseline gap-2">
              <span className="text-4xl font-bold">{plan.displayPrice}</span>
              <span className="text-[#ccc3d8]">{plan.displayUnit}</span>
            </div>

            {state.authenticated ? (
              <InteractiveButton
                type="button"
                actionId={`pricing-plan-${plan.code}`}
                sourcePage="pricing"
                onClick={() => handleSubscribe(plan.code)}
                disabled={pendingPlanCode !== null || plan.isCurrent}
                className={`mb-8 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200 ease-in-out ${
                  plan.isCurrent
                    ? "cursor-not-allowed border border-[#4cd7f6]/20 bg-[#062230] text-[#b6eeff]"
                    : `${plan.buttonClass} hover:scale-[1.02]`
                } ${pendingPlanCode !== null ? "opacity-80" : ""}`}
              >
                {pendingPlanCode === plan.code ? (
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    正在处理...
                  </span>
                ) : plan.isCurrent ? (
                  "当前方案"
                ) : (
                  plan.ctaByCycle[billingCycle]
                )}
              </InteractiveButton>
            ) : (
              <DebugLink
                href={plan.code === "free" ? "/interfaces/register" : "/interfaces/login"}
                label={`pricing-plan-${plan.name}`}
                sourcePage="pricing"
                className={`mb-8 block w-full rounded-lg py-3 text-center font-medium transition-all duration-200 ease-in-out hover:scale-[1.02] ${plan.buttonClass}`}
              >
                {plan.ctaByCycle[billingCycle]}
              </DebugLink>
            )}

            <ul className="flex-1 space-y-4">
              {plan.features.map((feature) => (
                <FeatureItem
                  key={feature.label}
                  enabled={feature.enabled}
                  label={feature.label}
                  emphasis={feature.emphasis}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mb-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-6">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-bold">
            <Coins className="h-5 w-5 text-[#4cd7f6]" />
            积分补充包
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {CREDIT_PACKS.map((pack) => (
              <div
                key={pack.code}
                className="rounded-2xl border border-[#4a4455]/20 bg-[#1c1a27] p-5"
              >
                <div className="mb-2 text-sm text-[#ccc3d8]">{pack.name}</div>
                <div className="text-2xl font-bold text-white">{pack.credits} 积分</div>
                <div className="mt-1 text-sm text-[#4cd7f6]">{pack.priceLabel}</div>
                <InteractiveButton
                  type="button"
                  actionId={`pricing-pack-${pack.code}`}
                  sourcePage="pricing"
                  onClick={() => handlePurchaseCredits(pack.code)}
                  disabled={pendingPackCode !== null}
                  className="mt-4 w-full rounded-lg border border-[#4a4455]/30 bg-[#201e2c] px-4 py-2.5 text-sm font-medium text-[#e5e0f3] transition-colors hover:bg-[#363342] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pendingPackCode === pack.code ? "购买中..." : "立即购买"}
                </InteractiveButton>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-6">
          <h3 className="mb-5 flex items-center gap-2 text-xl font-bold">
            <ReceiptText className="h-5 w-5 text-[#d2bbff]" />
            最近积分流水
          </h3>
          {state.recentTransactions.length > 0 ? (
            <div className="space-y-3">
              {state.recentTransactions.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-[#4a4455]/10 bg-[#1c1a27] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-medium text-white">
                        {item.description}
                      </div>
                      <div className="mt-1 text-xs text-[#958da1]">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-bold ${
                          item.amount >= 0 ? "text-[#4cd7f6]" : "text-[#ffb4ab]"
                        }`}
                      >
                        {item.amount >= 0 ? "+" : ""}
                        {item.amount}
                      </div>
                      <div className="mt-1 text-xs text-[#ccc3d8]">
                        余额 {item.balanceAfter}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#4a4455]/30 bg-[#1c1a27] px-4 py-5 text-sm text-[#958da1]">
              暂无积分流水，开通套餐或购买积分包后会显示在这里。
            </div>
          )}
        </div>
      </div>
    </>
  );
}
