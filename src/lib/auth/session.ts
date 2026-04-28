import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE_NAME = "melovision_session";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30;

function logSessionError(scope: string, error: unknown) {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[auth/session] ${scope}`, error);
  }
}

export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      token,
      expiresAt,
      userId,
    },
  });

  return { token, expiresAt };
}

export function setSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt: Date,
) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}

export async function getCurrentSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    if (session.expiresAt <= new Date()) {
      await prisma.session.delete({ where: { token } }).catch(() => undefined);
      return null;
    }

    return session;
  } catch (error) {
    logSessionError("getCurrentSession", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/interfaces/login?error=${encodeURIComponent("请先登录后继续")}`);
  }

  return user;
}

export async function clearSessionByToken(token: string) {
  try {
    await prisma.session.delete({ where: { token } }).catch(() => undefined);
  } catch (error) {
    logSessionError("clearSessionByToken", error);
  }
}
