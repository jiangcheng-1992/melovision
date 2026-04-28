import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { previewLiveSunoResponse } from "@/lib/mv/suno";

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "请先登录后再测试 Suno 接口" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      title?: string;
      conceptPrompt?: string;
      customLyrics?: string;
      musicGenerationMode?: "song" | "instrumental";
      visualStyle?: string;
      musicStyle?: string;
    };

    const payload = await previewLiveSunoResponse({
      title: body.title?.trim() || "午夜漫游者",
      conceptPrompt:
        body.conceptPrompt?.trim() ||
        "霓虹雨夜中的城市追逐，主角在回忆与现实之间穿梭，画面需要兼具电影感和情绪张力。",
      customLyrics: body.customLyrics?.trim() || undefined,
      musicGenerationMode: body.musicGenerationMode ?? "song",
      visualStyle: body.visualStyle?.trim() || "Cyberpunk",
      musicStyle: body.musicStyle?.trim() || "Lo-fi",
    });

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Suno 调试请求失败",
      },
      { status: 500 },
    );
  }
}
