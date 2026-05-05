import type { TimedLyricLine } from "@/storyboard";

export function sanitizeLyricsContent(rawText: string) {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const normalized = line.toLowerCase();
      return ![
        "aspect ratio:",
        "shot density:",
        "performance mode:",
        "subtitle mode:",
        "consistency boost:",
        "style preset:",
        "visual style:",
        "music style:",
        "project title:",
        "title:",
      ].some((prefix) => normalized.startsWith(prefix));
    })
    .join("\n")
    .trim();
}

export function estimateStoryboardIntroLeadIn(rawLyrics: string, totalDurationSec: number) {
  const cleaned = sanitizeLyricsContent(rawLyrics);
  if (!cleaned) {
    return 0;
  }

  const parts = cleaned
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[。！？!?]/))
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2 || totalDurationSec < 30) {
    return 0;
  }

  return Math.min(8, Math.max(4, Math.round(totalDurationSec * 0.04)));
}

export function roundStoryboardSecond(value: number) {
  return Number(value.toFixed(2));
}

export function buildTimedLyricsForStoryboard(rawLyrics: string, totalDurationSec: number, leadInSec = 0): TimedLyricLine[] {
  const parts = sanitizeLyricsContent(rawLyrics)
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[。！？!?]/))
    .map((part) => part.trim())
    .filter(Boolean);

  const safeParts = parts.length > 0 ? parts : ["为当前 MV 生成开场氛围与情绪推进镜头。"];
  const totalWeight = safeParts.reduce((sum, part) => sum + Math.max(1, part.replace(/\s+/g, "").length), 0);
  const effectiveLeadInSec = Math.max(0, Math.min(totalDurationSec - 0.5, leadInSec));
  const availableDuration = Math.max(0.5, totalDurationSec - effectiveLeadInSec);
  let cursor = effectiveLeadInSec;

  return safeParts.map((text, index) => {
    const rawDuration = (Math.max(8, availableDuration) * Math.max(1, text.replace(/\s+/g, "").length)) / totalWeight;
    const remaining = Math.max(0.5, totalDurationSec - cursor);
    const clampedDuration = Math.min(10, Math.max(2.5, rawDuration));
    const durationSec =
      index === safeParts.length - 1
        ? remaining
        : Math.min(remaining, clampedDuration);
    const startSec = roundStoryboardSecond(cursor);
    const endSec =
      index === safeParts.length - 1
        ? roundStoryboardSecond(Math.max(startSec + 0.5, totalDurationSec))
        : roundStoryboardSecond(startSec + durationSec);
    cursor = endSec;

    return {
      id: `lyric-${index + 1}`,
      text,
      startSec,
      endSec,
    };
  });
}
