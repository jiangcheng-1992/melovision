import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { CREDIT_COST_CATALOG, PLAN_CATALOG } from "@/lib/billing/catalog";
import { getBillingOverviewForUser } from "@/lib/billing/service";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({
      authenticated: false,
      plans: PLAN_CATALOG,
      creditCosts: CREDIT_COST_CATALOG,
      recentTransactions: [],
      summary: null,
    });
  }

  const overview = await getBillingOverviewForUser(user.id);

  return NextResponse.json({
    authenticated: true,
    ...overview,
  });
}
