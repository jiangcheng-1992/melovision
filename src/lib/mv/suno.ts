import "server-only";
import { sanitizeEnvValue } from "@/lib/env";

const SUNO_DEFAULT_BASE = "https://api.sunoapi.org/api/v1";
const SUNO_MODEL = "V4_5ALL";
const SUNO_POLL_ATTEMPTS = 12;
const SUNO_POLL_INTERVAL_MS = 5000;
const SUNO_TIMEOUT_MS = 20000;
const FALLBACK_ARTWORK_URL =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#14121f"/>
          <stop offset="100%" stop-color="#2b2836"/>
        </linearGradient>
      </defs>
      <rect width="512" height="512" fill="url(#bg)"/>
      <circle cx="256" cy="214" r="74" fill="#03b5d3" fill-opacity="0.2"/>
      <path d="M230 178v72l62-36-62-36z" fill="#4cd7f6"/>
      <text x="256" y="330" text-anchor="middle" fill="#e5e0f3" font-size="34" font-family="Arial, sans-serif">MeloVision</text>
      <text x="256" y="368" text-anchor="middle" fill="#958da1" font-size="18" font-family="Arial, sans-serif">Audio Cover</text>
    </svg>
  `);

export type SunoGenerationInput = {
  title: string;
  conceptPrompt: string;
  customLyrics?: string | null;
  musicGenerationMode?: "song" | "instrumental";
  visualStyle: string;
  musicStyle: string;
  aspectRatio?: string;
  shotDensity?: string;
  performanceMode?: string;
  subtitleMode?: string;
  consistencyBoost?: boolean;
};

export type SunoMusicOption = {
  title: string;
  lyricSnippet: string;
  lyrics?: string;
  durationSec: number;
  bpm: number;
  genre: string;
  tags: string;
  artworkUrl: string;
  audioUrl?: string;
  provider: "suno";
  providerRef: string;
};

export type SunoRecoveredAudioAsset = {
  downloadUrl: string;
  extension: string;
};

export type SunoPreviewResult = {
  enabled: boolean;
  request: {
    endpoint: string;
    method: "POST";
    body: Record<string, unknown>;
  };
  submitResponse?: unknown;
  taskId?: string;
  detailResponse?: unknown;
  normalizedTracks?: SunoMusicOption[];
  metrics?: {
    totalMs: number;
    submitMs: number;
    polls: Array<{
      attempt: number;
      elapsedMs: number;
      requestMs: number;
      tracksFound: number;
      status?: string;
      code?: number;
    }>;
  };
  warning?: string;
};

type SunoPreviewPollMetric = NonNullable<SunoPreviewResult["metrics"]>["polls"][number];

function nowMs() {
  return Date.now();
}

function summarizeInput(input: SunoGenerationInput) {
  return {
    title: input.title,
    musicStyle: input.musicStyle,
    visualStyle: input.visualStyle,
    promptLength: input.customLyrics?.trim().length || input.conceptPrompt.length,
    customLyrics: Boolean(input.customLyrics?.trim()),
  };
}

function logSuno(event: string, payload?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  if (payload) {
    console.info(`[suno] ${timestamp} ${event}`, payload);
    return;
  }

  console.info(`[suno] ${timestamp} ${event}`);
}

function getSunoBaseUrl() {
  const explicitBase = sanitizeEnvValue(process.env.SUNO_API_BASE);
  const base = explicitBase || SUNO_DEFAULT_BASE;

  try {
    const normalized = new URL(base);
    const pathname = normalized.pathname.replace(/\/+$/, "");

    if (!pathname || pathname === "/") {
      normalized.pathname = "/api/v1";
    }

    return normalized.toString().replace(/\/$/, "");
  } catch {
    return base.replace(/\/$/, "");
  }
}

function getSunoApiKey() {
  return sanitizeEnvValue(process.env.SUNO_API_KEY) || "";
}

function getSunoCallbackUrl() {
  const explicitUrl = sanitizeEnvValue(process.env.SUNO_CALLBACK_URL);
  if (explicitUrl) {
    return explicitUrl;
  }

  const appUrl = sanitizeEnvValue(process.env.NEXTAUTH_URL) || "http://localhost:3000";
  return `${appUrl.replace(/\/$/, "")}/api/webhooks/suno`;
}

export function isSunoEnabled() {
  return Boolean(getSunoApiKey());
}

function buildGeneratePayload(input: SunoGenerationInput) {
  const customLyrics = input.customLyrics?.trim();
  const musicGenerationMode = input.musicGenerationMode ?? "song";
  const isSongWithLyrics = musicGenerationMode === "song" && Boolean(customLyrics);
  const prompt = isSongWithLyrics
    ? customLyrics!
    : [
        input.conceptPrompt,
        `Aspect Ratio: ${input.aspectRatio ?? "16:9"}`,
        `Shot Density: ${input.shotDensity ?? "balanced"}`,
        `Performance Mode: ${input.performanceMode ?? "cinematic"}`,
        `Subtitle Mode: ${input.subtitleMode ?? "stylized"}`,
        `Consistency Boost: ${input.consistencyBoost ? "on" : "off"}`,
      ].join("\n");

  return {
    customMode: true,
    instrumental: musicGenerationMode === "instrumental",
    model: SUNO_MODEL,
    title: input.title,
    prompt,
    style: `${input.musicStyle}, ${input.visualStyle}, ${input.aspectRatio ?? "16:9"}`,
    negativeTags: "low quality, clipping, distorted vocals",
    callBackUrl: getSunoCallbackUrl(),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sunoFetch(path: string, init?: RequestInit) {
  const apiKey = getSunoApiKey();
  if (!apiKey) {
    throw new Error("SUNO_API_KEY_MISSING");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUNO_TIMEOUT_MS);

  try {
    const response = await fetch(`${getSunoBaseUrl()}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(`SUNO_HTTP_${response.status}:${data?.msg || response.statusText}`);
    }

    if (data?.code && data.code !== 200) {
      throw new Error(`SUNO_API_${data.code}:${data?.msg || "unknown_error"}`);
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function firstNumber(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }

  return undefined;
}

function normalizeArtworkUrl(value: unknown) {
  const resolved = firstString(value);
  if (!resolved) {
    return FALLBACK_ARTWORK_URL;
  }

  if (resolved.startsWith("data:image/")) {
    return resolved;
  }

  try {
    const parsed = new URL(resolved);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    // Ignore malformed external artwork URLs and fall back to a safe inline placeholder.
  }

  return FALLBACK_ARTWORK_URL;
}

function normalizeTags(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) {
    const result = value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
    if (result.length > 0) return result;
  }

  if (typeof value === "string" && value.trim()) {
    const result = value.split(",").map((item) => item.trim()).filter(Boolean);
    if (result.length > 0) return result;
  }

  return fallback;
}

function isTrackLike(value: unknown) {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return Boolean(
    firstString(
      record.audioUrl,
      record.audio_url,
      record.streamAudioUrl,
      record.stream_audio_url,
      record.title,
      record.imageUrl,
      record.image_url,
      record.lyric,
      record.lyrics,
    ),
  );
}

function collectTrackCandidates(value: unknown, depth = 0): Record<string, unknown>[] {
  if (depth > 6 || !value) {
    return [];
  }

  if (Array.isArray(value)) {
    if (value.every((item) => isTrackLike(item))) {
      return value as Record<string, unknown>[];
    }

    return value.flatMap((item) => collectTrackCandidates(item, depth + 1));
  }

  if (typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const priorityKeys = ["clips", "items", "list", "records", "data", "songs", "audios"];

  for (const key of priorityKeys) {
    if (key in record) {
      const matches = collectTrackCandidates(record[key], depth + 1);
      if (matches.length > 0) {
        return matches;
      }
    }
  }

  return Object.values(record).flatMap((item) => collectTrackCandidates(item, depth + 1));
}

function extractTaskId(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  return firstString(
    record.taskId,
    record.task_id,
    (record.data as Record<string, unknown> | undefined)?.taskId,
    (record.data as Record<string, unknown> | undefined)?.task_id,
    (record.data as Record<string, unknown> | undefined)?.id,
  );
}

function extractResponseCode(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  return firstNumber((payload as Record<string, unknown>).code);
}

function extractResponseStatus(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  return firstString(
    record.status,
    record.msg,
    (record.data as Record<string, unknown> | undefined)?.status,
    (record.data as Record<string, unknown> | undefined)?.state,
  );
}

function extractNestedString(value: unknown, paths: string[][]) {
  for (const path of paths) {
    let current: unknown = value;
    let matched = true;

    for (const key of path) {
      if (!current || typeof current !== "object" || !(key in (current as Record<string, unknown>))) {
        matched = false;
        break;
      }
      current = (current as Record<string, unknown>)[key];
    }

    if (matched) {
      const resolved = firstString(current);
      if (resolved) {
        return resolved;
      }
    }
  }

  return undefined;
}

function buildLyricSnippet(track: Record<string, unknown>, fallback: string) {
  const source = cleanLyricsText(
    firstString(
      track.lyricSnippet,
      track.lyric_snippet,
      track.lyric,
      track.lyrics,
      track.prompt,
      track.gpt_description_prompt,
      fallback,
    ) || fallback,
  );

  return source.split(/\r?\n/)[0]?.slice(0, 120) || fallback;
}

function cleanLyricsText(input: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const normalized = line.toLowerCase();
      if (!normalized) {
        return false;
      }

      // Filter out technical/config lines that sometimes leak back from request prompts.
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
    });

  return lines.join("\n").trim();
}

function resolveLyrics(track: Record<string, unknown>) {
  const source = firstString(
    track.lyrics,
    track.lyric,
    track.lyricSnippet,
    track.lyric_snippet,
    track.prompt,
    track.gpt_description_prompt,
  );

  const cleaned = source ? cleanLyricsText(source) : "";
  return cleaned || undefined;
}

function normalizeTrack(
  track: Record<string, unknown>,
  index: number,
  taskId: string | undefined,
  input: SunoGenerationInput,
): SunoMusicOption {
  const tags = normalizeTags(track.tags, [input.musicStyle, input.visualStyle]);
  const genre = firstString(track.style, track.genre, tags[0], input.musicStyle) || input.musicStyle;

  return {
    title: firstString(track.title, `${input.title} · Suno 版本 ${index + 1}`) || `${input.title} · Suno 版本 ${index + 1}`,
    lyricSnippet: buildLyricSnippet(track, input.conceptPrompt),
    lyrics: resolveLyrics(track),
    durationSec: Math.round(firstNumber(track.durationSec, track.duration, track.audio_duration) || 180),
    bpm: Math.round(firstNumber(track.bpm, track.tempo) || 120),
    genre,
    tags: tags.join(","),
    artworkUrl: normalizeArtworkUrl(
      firstString(track.imageUrl, track.image_url, track.image, track.cover),
    ),
    audioUrl: firstString(track.streamAudioUrl, track.stream_audio_url, track.audioUrl, track.audio_url),
    provider: "suno",
    providerRef:
      firstString(track.id, track.audioId, track.audio_id, track.clip_id) ||
      `${taskId || input.title}-clip-${index + 1}`,
  };
}

export async function recoverSunoAudioAsset(audioId: string): Promise<SunoRecoveredAudioAsset | null> {
  if (!audioId.trim() || !isSunoEnabled()) {
    return null;
  }

  try {
    const generateResponse = await sunoFetch("/wav/generate", {
      method: "POST",
      body: JSON.stringify({
        audioId,
        callBackUrl: getSunoCallbackUrl(),
      }),
    });

    const taskId = extractTaskId(generateResponse);
    if (!taskId) {
      return null;
    }

    for (let attempt = 0; attempt < 6; attempt += 1) {
      if (attempt > 0) {
        await sleep(3000);
      }

      const detailResponse = await sunoFetch(
        `/wav/record-info?taskId=${encodeURIComponent(taskId)}`,
        { method: "GET" },
      );

      const successFlag = extractNestedString(detailResponse, [
        ["data", "successFlag"],
        ["data", "status"],
        ["status"],
      ]);

      const downloadUrl = extractNestedString(detailResponse, [
        ["data", "response", "audioWavUrl"],
        ["data", "response", "audio_wav_url"],
        ["data", "audioWavUrl"],
        ["data", "audio_wav_url"],
      ]);

      if (downloadUrl) {
        return {
          downloadUrl,
          extension: "wav",
        };
      }

      if (successFlag && successFlag !== "PENDING" && successFlag !== "PROCESSING") {
        break;
      }
    }
  } catch (error) {
    logSuno("audio_recover_failed", {
      audioId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return null;
}

export async function generateMusicOptionsWithSuno(input: SunoGenerationInput) {
  if (!isSunoEnabled()) {
    logSuno("skip_generation", {
      reason: "SUNO_API_KEY_MISSING",
      ...summarizeInput(input),
    });
    return null;
  }

  const startedAt = nowMs();
  const submitPayload = buildGeneratePayload(input);
  logSuno("generation_start", summarizeInput(input));

  try {
    const submitStartedAt = nowMs();
    const submitResponse = await sunoFetch("/generate", {
      method: "POST",
      body: JSON.stringify(submitPayload),
    });
    const submitMs = nowMs() - submitStartedAt;

    const taskId = extractTaskId(submitResponse);
    logSuno("submit_complete", {
      submitMs,
      taskId: taskId ?? null,
      code: extractResponseCode(submitResponse),
      status: extractResponseStatus(submitResponse),
      ...summarizeInput(input),
    });

    if (!taskId) {
      throw new Error("SUNO_TASK_ID_MISSING");
    }

    for (let attempt = 0; attempt < SUNO_POLL_ATTEMPTS; attempt += 1) {
      if (attempt > 0) {
        logSuno("poll_wait", {
          taskId,
          attempt: attempt + 1,
          sleepMs: SUNO_POLL_INTERVAL_MS,
          elapsedMs: nowMs() - startedAt,
        });
        await sleep(SUNO_POLL_INTERVAL_MS);
      }

      const pollStartedAt = nowMs();
      const detailResponse = await sunoFetch(
        `/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
        { method: "GET" },
      );
      const requestMs = nowMs() - pollStartedAt;

      const tracks = collectTrackCandidates(detailResponse);
      logSuno("poll_complete", {
        taskId,
        attempt: attempt + 1,
        requestMs,
        elapsedMs: nowMs() - startedAt,
        tracksFound: tracks.length,
        code: extractResponseCode(detailResponse),
        status: extractResponseStatus(detailResponse),
      });

      if (tracks.length > 0) {
        const normalizedTracks = tracks.map((track, index) =>
          normalizeTrack(track, index, taskId, input),
        );

        logSuno("generation_ready", {
          taskId,
          totalMs: nowMs() - startedAt,
          submitMs,
          trackCount: normalizedTracks.length,
        });

        return normalizedTracks;
      }
    }

    logSuno("generation_timeout", {
      taskId,
      totalMs: nowMs() - startedAt,
      pollAttempts: SUNO_POLL_ATTEMPTS,
    });

    throw new Error("SUNO_TRACKS_NOT_READY");
  } catch (error) {
    logSuno("generation_failed", {
      totalMs: nowMs() - startedAt,
      error: error instanceof Error ? error.message : String(error),
      ...summarizeInput(input),
    });
    throw error;
  }
}

export async function previewLiveSunoResponse(input: SunoGenerationInput): Promise<SunoPreviewResult> {
  const startedAt = nowMs();
  const request = {
    endpoint: `${getSunoBaseUrl()}/generate`,
    method: "POST" as const,
    body: buildGeneratePayload(input),
  };

  if (!isSunoEnabled()) {
    return {
      enabled: false,
      request,
      metrics: {
        totalMs: 0,
        submitMs: 0,
        polls: [],
      },
      warning: "SUNO_API_KEY 未配置，无法发起真实请求",
    };
  }

  const polls: SunoPreviewPollMetric[] = [];
  const submitStartedAt = nowMs();
  const submitResponse = await sunoFetch("/generate", {
    method: "POST",
    body: JSON.stringify(request.body),
  });
  const submitMs = nowMs() - submitStartedAt;

  const taskId = extractTaskId(submitResponse);
  if (!taskId) {
    return {
      enabled: true,
      request,
      submitResponse,
      metrics: {
        totalMs: nowMs() - startedAt,
        submitMs,
        polls,
      },
      warning: "提交成功，但未从响应中解析出 taskId",
    };
  }

  const detailStartedAt = nowMs();
  const detailResponse = await sunoFetch(
    `/generate/record-info?taskId=${encodeURIComponent(taskId)}`,
    { method: "GET" },
  );
  const requestMs = nowMs() - detailStartedAt;
  const tracks = collectTrackCandidates(detailResponse);

  polls.push({
    attempt: 1,
    elapsedMs: nowMs() - startedAt,
    requestMs,
    tracksFound: tracks.length,
    status: extractResponseStatus(detailResponse),
    code: extractResponseCode(detailResponse),
  });

  const normalizedTracks = tracks.map((track, index) =>
    normalizeTrack(track, index, taskId, input),
  );

  return {
    enabled: true,
    request,
    submitResponse,
    taskId,
    detailResponse,
    normalizedTracks,
    metrics: {
      totalMs: nowMs() - startedAt,
      submitMs,
      polls,
    },
  };
}
