import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = { warning: "callback body is not valid json" };
  }

  console.info("[suno.callback] received", {
    timestamp: new Date().toISOString(),
    payload,
  });

  return NextResponse.json({ ok: true });
}
