import { NextResponse } from "next/server";
import { previewMockSunoResponse } from "@/lib/mv/workflow";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get("title") ?? "午夜漫游者";
  const conceptPrompt =
    searchParams.get("conceptPrompt") ??
    "霓虹雨夜中的城市追逐，主角在回忆与现实之间穿梭，画面需要兼具电影感和情绪张力。";
  const customLyrics = searchParams.get("customLyrics") ?? undefined;
  const visualStyle = searchParams.get("visualStyle") ?? "Cyberpunk";
  const musicStyle = searchParams.get("musicStyle") ?? "Lo-fi";

  const payload = previewMockSunoResponse({
    title,
    conceptPrompt,
    customLyrics,
    visualStyle,
    musicStyle,
  });

  return NextResponse.json(payload);
}
