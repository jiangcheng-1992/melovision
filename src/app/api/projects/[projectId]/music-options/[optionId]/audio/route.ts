import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

function sanitizeFileName(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase() || "melovision-audio"
  );
}

function buildMockAudioWav(seed: string, durationSec = 24) {
  const sampleRate = 22050;
  const channelCount = 1;
  const bitsPerSample = 16;
  const totalSamples = sampleRate * durationSec;
  const byteRate = sampleRate * channelCount * (bitsPerSample / 8);
  const blockAlign = channelCount * (bitsPerSample / 8);
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseFreq = 180 + (hash % 180);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(channelCount, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < totalSamples; i += 1) {
    const t = i / sampleRate;
    const fadeIn = Math.min(1, t / 0.8);
    const fadeOut = Math.min(1, (durationSec - t) / 1.2);
    const envelope = Math.max(0, Math.min(fadeIn, fadeOut));
    const sample =
      Math.sin(2 * Math.PI * baseFreq * t) * 0.22 +
      Math.sin(2 * Math.PI * (baseFreq * 1.5) * t) * 0.08;
    const value = Math.max(-1, Math.min(1, sample * envelope));
    buffer.writeInt16LE(Math.floor(value * 32767), 44 + i * 2);
  }

  return buffer;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; optionId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId, optionId } = await params;
  const download = new URL(request.url).searchParams.get("download") === "1";
  const option = await prisma.musicOption.findFirst({
    where: {
      id: optionId,
      projectId,
      project: {
        userId: user.id,
      },
    },
    select: {
      id: true,
      title: true,
      audioUrl: true,
      provider: true,
      providerRef: true,
    },
  });

  if (!option) {
    return NextResponse.json({ error: "MUSIC_OPTION_NOT_FOUND" }, { status: 404 });
  }

  if (!option.audioUrl) {
    return NextResponse.json({ error: "AUDIO_URL_NOT_READY" }, { status: 409 });
  }

  if (option.provider === "suno_mock" || option.audioUrl.includes("mock-suno.local")) {
    const wav = buildMockAudioWav(option.providerRef || option.id);
    const fileName = `${sanitizeFileName(option.title || option.id)}.wav`;
    return new NextResponse(wav, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
      },
    });
  }

  try {
    const upstream = await fetch(option.audioUrl, {
      cache: "no-store",
      headers: {
        "User-Agent": "MeloVision/1.0",
      },
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "AUDIO_FETCH_FAILED", status: upstream.status },
        { status: 502 },
      );
    }

    const fallbackExtension =
      upstream.headers.get("content-type")?.includes("wav") ? "wav" : "mp3";
    const fileName = `${sanitizeFileName(option.title || option.id)}.${fallbackExtension}`;

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "audio/mpeg",
        "Cache-Control": "no-store",
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AUDIO_FETCH_FAILED" },
      { status: 502 },
    );
  }
}
