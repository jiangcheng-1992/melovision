import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let payload: unknown = null;

  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  console.info("[volcengine.video.callback] received", {
    timestamp: new Date().toISOString(),
    payload,
  });

  return NextResponse.json({ ok: true });
}
