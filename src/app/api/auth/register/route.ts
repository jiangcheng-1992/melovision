import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { ensureBillingProfile } from "@/lib/billing/service";
import { buildRedirectUrl } from "@/lib/http/redirect";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "昵称至少 2 个字符")
    .max(32, "昵称不能超过 32 个字符"),
  email: z.email("请输入有效邮箱").transform((value) => value.toLowerCase()),
  password: z
    .string()
    .min(8, "密码至少 8 位")
    .max(72, "密码不能超过 72 位"),
  terms: z.literal("on", {
    error: "请先同意服务条款和隐私政策",
  }),
});

function redirectWithError(request: Request, error: string) {
  return NextResponse.redirect(
    buildRedirectUrl(
      request,
      `/interfaces/register?error=${encodeURIComponent(error)}`,
    ),
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = registerSchema.safeParse({
      displayName: formData.get("displayName"),
      email: formData.get("email"),
      password: formData.get("password"),
      terms: formData.get("terms"),
    });

    if (!parsed.success) {
      return redirectWithError(request, parsed.error.issues[0]?.message ?? "注册信息不完整");
    }

    const { displayName, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return redirectWithError(request, "该邮箱已注册，请直接登录");
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        displayName,
        email,
        passwordHash,
      },
    });

    try {
      await ensureBillingProfile(user.id);
    } catch (error) {
      console.error("[auth/register] billing bootstrap failed", error);
    }

    const session = await createSession(user.id);
    const response = NextResponse.redirect(
      buildRedirectUrl(request, "/interfaces/projects?auth=registered"),
    );

    setSessionCookie(response, session.token, session.expiresAt);

    return response;
  } catch (error) {
    console.error("[auth/register] failed", error);
    return redirectWithError(request, "注册服务暂时不可用，请稍后重试");
  }
}
