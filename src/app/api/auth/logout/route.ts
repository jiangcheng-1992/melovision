import { NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  clearSessionByToken,
  clearSessionCookie,
} from "@/lib/auth/session";

export async function POST(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (token) {
    await clearSessionByToken(token);
  }

  const response = NextResponse.redirect(
    new URL("/interfaces/login?message=logged-out", request.url),
  );
  clearSessionCookie(response);

  return response;
}
