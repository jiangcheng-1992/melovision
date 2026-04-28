import { NextResponse } from "next/server";
import { getExploreFeed } from "@/lib/explore/service";

export async function GET() {
  const feed = await getExploreFeed();
  return NextResponse.json(feed);
}
