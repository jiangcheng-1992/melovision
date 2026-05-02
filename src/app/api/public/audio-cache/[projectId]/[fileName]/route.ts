import { NextResponse } from "next/server";

import { readCachedMusicOptionAsset } from "@/lib/mv/audio-cache";

function toBinaryResponseBody(buffer: Buffer) {
  return new Uint8Array(buffer);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; fileName: string }> },
) {
  const { projectId, fileName } = await params;
  const asset = await readCachedMusicOptionAsset(projectId, fileName);

  if (!asset) {
    return NextResponse.json({ error: "AUDIO_ASSET_NOT_FOUND" }, { status: 404 });
  }

  return new NextResponse(toBinaryResponseBody(asset.buffer), {
    status: 200,
    headers: {
      "Content-Type": asset.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": `${asset.buffer.byteLength}`,
    },
  });
}
