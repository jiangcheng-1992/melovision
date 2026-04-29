import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  clearSessionByToken,
  clearSessionCookie,
} from "@/lib/auth/session";
import { buildRedirectUrl } from "@/lib/http/redirect";

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";
    const token = cookieHeader
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
      ?.split("=")[1];

    if (token) {
      await clearSessionByToken(token);
    }
  } catch (error) {
    console.error("[auth/logout] failed", error);
  }

  const response = NextResponse.redirect(
    buildRedirectUrl(request, "/interfaces/login?message=logged-out"),
  );
  clearSessionCookie(response);

  return response;
}
