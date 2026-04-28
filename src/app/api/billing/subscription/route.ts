import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { changeSubscriptionForUser, getBillingOverviewForUser } from "@/lib/billing/service";

const subscriptionSchema = z.object({
  planCode: z.enum(["free", "creator", "pro"]),
  billingCycle: z.enum(["monthly", "yearly"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = subscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_SUBSCRIPTION_REQUEST", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await changeSubscriptionForUser(
    user.id,
    parsed.data.planCode,
    parsed.data.billingCycle,
  );

  const overview = await getBillingOverviewForUser(user.id);

  return NextResponse.json({
    ok: true,
    message: "套餐已更新",
    ...overview,
  });
}
