import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getBillingOverviewForUser,
  purchaseCreditPackForUser,
} from "@/lib/billing/service";

const purchaseSchema = z.object({
  packCode: z.enum(["starter", "creator", "studio"]),
});

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = purchaseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_CREDIT_PACK_REQUEST", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const purchase = await purchaseCreditPackForUser(user.id, parsed.data.packCode);
  const overview = await getBillingOverviewForUser(user.id);

  return NextResponse.json({
    ok: true,
    message: "积分购买成功",
    purchase,
    ...overview,
  });
}
