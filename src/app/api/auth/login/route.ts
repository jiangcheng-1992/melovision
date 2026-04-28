import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyPassword } from "@/lib/auth/password";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.email("请输入有效邮箱").transform((value) => value.toLowerCase()),
  password: z.string().min(1, "请输入密码"),
});

function redirectWithError(request: Request, error: string) {
  return NextResponse.redirect(
    new URL(`/interfaces/login?error=${encodeURIComponent(error)}`, request.url),
  );
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return redirectWithError(request, parsed.error.issues[0]?.message ?? "登录信息不完整");
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return redirectWithError(request, "账号或密码错误");
    }

    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return redirectWithError(request, "账号或密码错误");
    }

    const session = await createSession(user.id);
    const response = NextResponse.redirect(
      new URL("/interfaces/projects?auth=logged-in", request.url),
    );

    setSessionCookie(response, session.token, session.expiresAt);

    return response;
  } catch (error) {
    console.error("[auth/login] failed", error);
    return redirectWithError(request, "登录服务暂时不可用，请稍后重试");
  }
}
