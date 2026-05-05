import "server-only";
import { sanitizeEnvValue } from "@/lib/env";

const VOLCENGINE_DEFAULT_BASE = "https://ark.cn-beijing.volces.com/api/v3";
const VOLCENGINE_CHAT_MODEL = "doubao-1-5-lite-32k-250115";
const VOLCENGINE_IMAGE_MODEL = "seedream-3-0-t2i-250415";
const VOLCENGINE_VIDEO_MODEL = "doubao-seedance-1-0-pro-fast";
const VOLCENGINE_TIMEOUT_MS = 60000;
const VOLCENGINE_VIDEO_POLL_INTERVAL_MS = 5000;
const VOLCENGINE_VIDEO_POLL_ATTEMPTS = 36;

type StoryboardImageInput = {
  prompt: string;
  visualStyle: string;
  aspectRatio?: string;
  seed?: number;
};

type VideoSceneInput = {
  sortOrder: number;
  prompt: string;
  videoPrompt?: string;
  sharedContext?: string;
  identityLock?: string;
  negativePrompt?: string;
  continuityLine?: string | null;
  lyricLine: string;
  subtitleText?: string;
  previewImageUrl?: string | null;
  firstFrameUrl?: string | null;
  lastFrameUrl?: string | null;
  referenceImageUrls?: string[];
};

export type VolcengineVideoGenerationInput = {
  title: string;
  conceptPrompt: string;
  visualStyle: string;
  musicStyle: string;
  scenes: VideoSceneInput[];
  aspectRatio?: string;
  durationSec?: number;
  resolution?: string;
  generateAudio?: boolean;
  referenceAudioUrl?: string | null;
};

export type VolcengineVideoTask = {
  provider: "volcengine";
  taskId: string;
  status: string;
};

export type VolcengineVideoTaskStatus = {
  provider: "volcengine";
  taskId: string;
  status: "queued" | "running" | "succeeded" | "failed" | "expired" | "cancelled";
  videoUrl?: string;
  lastFrameUrl?: string;
  errorCode?: string;
  errorMessage?: string;
  raw?: unknown;
};

function nowMs() {
  return Date.now();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function logVolcengine(event: string, payload?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  if (payload) {
    console.info(`[volcengine] ${timestamp} ${event}`, payload);
    return;
  }

  console.info(`[volcengine] ${timestamp} ${event}`);
}

function getVolcengineBaseUrl() {
  return (sanitizeEnvValue(process.env.VOLCENGINE_ARK_BASE_URL) || VOLCENGINE_DEFAULT_BASE).replace(
    /\/$/,
    "",
  );
}

function getVolcengineApiKey() {
  return sanitizeEnvValue(process.env.VOLCENGINE_ARK_API_KEY) || "";
}

function getVolcengineImageModel() {
  return sanitizeEnvValue(process.env.VOLCENGINE_IMAGE_MODEL) || VOLCENGINE_IMAGE_MODEL;
}

function getVolcengineChatModel() {
  return sanitizeEnvValue(process.env.VOLCENGINE_CHAT_MODEL) || VOLCENGINE_CHAT_MODEL;
}

function getVolcengineVideoModel() {
  return sanitizeEnvValue(process.env.VOLCENGINE_VIDEO_MODEL) || VOLCENGINE_VIDEO_MODEL;
}

function getVolcengineVideoCallbackUrl() {
  const explicit = sanitizeEnvValue(process.env.VOLCENGINE_VIDEO_CALLBACK_URL);
  if (explicit) {
    return explicit;
  }

  const appUrl = sanitizeEnvValue(process.env.NEXTAUTH_URL);
  if (!appUrl) {
    return undefined;
  }

  return `${appUrl.replace(/\/$/, "")}/api/webhooks/volcengine/video`;
}

function normalizeAspectRatio(value?: string | null) {
  const normalized = value?.trim();
  if (!normalized) {
    return "16:9";
  }

  const mappings: Record<string, string> = {
    "16 / 9": "16:9",
    "16:9": "16:9",
    "9:16": "9:16",
    "1:1": "1:1",
    "4:3": "4:3",
    "3:4": "3:4",
    "21:9": "21:9",
  };

  return mappings[normalized] || "16:9";
}

function getImageSizeForAspectRatio(value?: string | null) {
  const ratio = normalizeAspectRatio(value);
  const mappings: Record<string, string> = {
    "16:9": "2560x1440",
    "9:16": "1440x2560",
    "1:1": "2048x2048",
    "4:3": "2304x1728",
    "3:4": "1728x2304",
    "21:9": "2940x1260",
  };

  return mappings[ratio] || "1536x864";
}

function mapResolution(value?: string | null) {
  const normalized = value?.toLowerCase().trim();
  const model = getVolcengineVideoModel().toLowerCase();
  if (!normalized) {
    return "720p";
  }

  if (normalized.includes("1080")) {
    if (model.includes("seedance-2-0-fast") || model.includes("ggl8b")) {
      return "720p";
    }

    return "1080p";
  }
  if (normalized.includes("480")) return "480p";
  return "720p";
}

function isRemoteAssetUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return /^https?:\/\//i.test(value.trim());
}

function isSameRemoteAssetUrl(left?: string | null, right?: string | null) {
  if (!left || !right) {
    return false;
  }

  return left.trim() === right.trim();
}

function summarizeAssetUrl(value?: string | null) {
  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(value);
    const pathSegments = parsed.pathname.split("/").filter(Boolean);
    const tail = pathSegments.slice(-2).join("/") || parsed.pathname;
    return `${parsed.host}/${tail}`;
  } catch {
    return value.slice(0, 120);
  }
}

function buildStoryboardImagePrompt(input: StoryboardImageInput) {
  return [
    input.prompt,
    `整体视觉风格：${input.visualStyle}`,
    "要求：高质量电影分镜图、单帧叙事明确、角色一致、镜头语言清晰、避免文字水印、避免多余边框。",
  ].join("\n");
}

function buildVideoPrompt(input: VolcengineVideoGenerationInput) {
  const sceneLines = input.scenes
    .slice(0, 8)
    .map(
      (scene) =>
        [
          `Scene ${scene.sortOrder + 1}: ${scene.lyricLine}`,
          scene.sharedContext ? `共享上下文：${scene.sharedContext}` : null,
          scene.identityLock ? `角色锁：${scene.identityLock}` : null,
          scene.continuityLine ? `承接关系：${scene.continuityLine}` : null,
          scene.subtitleText ? `字幕对应歌词：${scene.subtitleText}` : null,
          `视频提示词：${scene.videoPrompt ?? scene.prompt}`,
          scene.negativePrompt ? `负向约束：${scene.negativePrompt}` : null,
        ]
          .filter(Boolean)
          .join("\n"),
    )
    .join("\n\n");

  return [
    `为歌曲《${input.title}》生成一个高质量音乐短片。`,
    `核心概念：${input.conceptPrompt}`,
    `视觉风格：${input.visualStyle}`,
    `音乐风格：${input.musicStyle}`,
    "要求画面连贯、主体一致、镜头自然衔接、节奏贴合音乐、具有电影感。",
    sceneLines,
  ]
    .filter(Boolean)
    .join("\n");
}

function firstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function getValueAtPath(input: unknown, path: string[]) {
  let current: unknown = input;

  for (const segment of path) {
    if (!current || typeof current !== "object" || !(segment in current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function extractUrlCandidate(value: unknown): string | undefined {
  if (typeof value === "string") {
    return firstString(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = extractUrlCandidate(item);
      if (candidate) {
        return candidate;
      }
    }
    return undefined;
  }

  if (value && typeof value === "object") {
    return firstString(
      (value as Record<string, unknown>).url,
      (value as Record<string, unknown>).uri,
      (value as Record<string, unknown>).src,
      (value as Record<string, unknown>).href,
    );
  }

  return undefined;
}

function extractResponseUrl(source: unknown, paths: string[][]) {
  for (const path of paths) {
    const candidate = extractUrlCandidate(getValueAtPath(source, path));
    if (candidate) {
      return candidate;
    }
  }

  return undefined;
}

function parseJsonResponseContent(content: string) {
  const trimmed = content.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1]?.trim();
  const candidate = fenced || trimmed;

  return JSON.parse(candidate) as unknown;
}

async function volcengineFetch(path: string, init?: RequestInit) {
  const apiKey = getVolcengineApiKey();
  if (!apiKey) {
    throw new Error("VOLCENGINE_API_KEY_MISSING");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VOLCENGINE_TIMEOUT_MS);
  const startedAt = nowMs();

  try {
    const response = await fetch(`${getVolcengineBaseUrl()}${path}`, {
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
      const message =
        data?.error?.message ||
        data?.message ||
        response.statusText ||
        "request_failed";
      throw new Error(`VOLCENGINE_HTTP_${response.status}:${message}`);
    }

    if (data?.error?.message) {
      throw new Error(`VOLCENGINE_API_ERROR:${data.error.message}`);
    }

    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logVolcengine("request_failed", {
      path,
      totalMs: nowMs() - startedAt,
      aborted: controller.signal.aborted,
      error: message,
    });
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export function isVolcengineEnabled() {
  return Boolean(getVolcengineApiKey());
}

export async function optimizeStoryboardPromptWithVolcengine(input: {
  projectTitle: string;
  visualStyle: string;
  musicStyle: string;
  lyricLine: string;
  prompt: string;
}) {
  if (!isVolcengineEnabled()) {
    return null;
  }

  const payload = {
    model: getVolcengineChatModel(),
    messages: [
      {
        role: "system",
        content:
          "你是专业 MV 分镜导演与提示词优化助手。请输出一段可直接用于图像生成的中文分镜提示词，不要加解释、不要分点、不要 markdown。",
      },
      {
        role: "user",
        content: [
          `项目标题：${input.projectTitle}`,
          `视觉风格：${input.visualStyle}`,
          `音乐风格：${input.musicStyle}`,
          `歌词片段：${input.lyricLine}`,
          `当前分镜提示词：${input.prompt}`,
          "请强化主体一致性、镜头语言、动作连续性、空间层次、电影感和光影氛围，输出 1 段优化后的分镜提示词。",
        ].join("\n"),
      },
    ],
  };

  const startedAt = nowMs();
  logVolcengine("chat_optimize_start", {
    model: payload.model,
    projectTitle: input.projectTitle,
  });

  const response = await volcengineFetch("/chat/completions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const content = firstString(response?.choices?.[0]?.message?.content);

  logVolcengine("chat_optimize_complete", {
    model: payload.model,
    totalMs: nowMs() - startedAt,
    hasContent: Boolean(content),
  });

  if (!content) {
    throw new Error("VOLCENGINE_CHAT_CONTENT_MISSING");
  }

  return content;
}

export async function generateSongLyricsWithVolcengine(input: {
  title: string;
  conceptPrompt: string;
  musicStyle: string;
  visualStyle?: string;
}) {
  if (!isVolcengineEnabled()) {
    return null;
  }

  const payload = {
    model: getVolcengineChatModel(),
    messages: [
      {
        role: "system",
        content: [
          "你是专业中文作词人。",
          "你的任务是根据歌曲标题、歌曲主题描述和音乐风格，直接写出可演唱的中文歌词。",
          "只输出歌词正文，不要解释，不要分点，不要 markdown，不要输出标题。",
          "这不是 MV 分镜提示词，也不是视频画面描述，不要输出镜头、运镜、场景调度、提示词格式。",
        ].join(""),
      },
      {
        role: "user",
        content: [
          `歌曲标题：${input.title}`,
          `歌曲主题描述：${input.conceptPrompt}`,
          `音乐风格：${input.musicStyle}`,
          input.visualStyle ? `补充视觉气质参考：${input.visualStyle}` : null,
          "要求：输出 8 到 12 行中文歌词；具有可唱性、押韵感和情绪推进；内容要围绕标题和主题展开；禁止输出解释性文字。",
        ]
          .filter(Boolean)
          .join("\n"),
      },
    ],
  };

  const startedAt = nowMs();
  logVolcengine("lyrics_generation_start", {
    model: payload.model,
    title: input.title,
    musicStyle: input.musicStyle,
  });

  const response = await volcengineFetch("/chat/completions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const content = firstString(response?.choices?.[0]?.message?.content);
  logVolcengine("lyrics_generation_complete", {
    model: payload.model,
    totalMs: nowMs() - startedAt,
    hasContent: Boolean(content),
    title: input.title,
  });

  if (!content) {
    throw new Error("VOLCENGINE_LYRICS_CONTENT_MISSING");
  }

  return content;
}

export async function invokeJsonWithVolcengine(input: {
  systemPrompt: string;
  userPrompt: string;
}) {
  if (!isVolcengineEnabled()) {
    return null;
  }

  const payload = {
    model: getVolcengineChatModel(),
    messages: [
      {
        role: "system",
        content: `${input.systemPrompt}\n请仅输出单个合法 JSON 对象，不要输出 markdown，不要输出解释。`,
      },
      {
        role: "user",
        content: input.userPrompt,
      },
    ],
  };

  const startedAt = nowMs();
  logVolcengine("chat_json_start", {
    model: payload.model,
  });

  const response = await volcengineFetch("/chat/completions", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const content = firstString(response?.choices?.[0]?.message?.content);
  logVolcengine("chat_json_complete", {
    model: payload.model,
    totalMs: nowMs() - startedAt,
    hasContent: Boolean(content),
  });

  if (!content) {
    throw new Error("VOLCENGINE_CHAT_JSON_CONTENT_MISSING");
  }

  try {
    return parseJsonResponseContent(content);
  } catch (error) {
    throw new Error(
      `VOLCENGINE_CHAT_JSON_PARSE_FAILED:${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

export async function generateStoryboardImageWithVolcengine(
  input: StoryboardImageInput,
) {
  if (!isVolcengineEnabled()) {
    logVolcengine("image_generation_skipped", {
      reason: "VOLCENGINE_API_KEY_MISSING",
    });
    return null;
  }

  const payload = {
    model: getVolcengineImageModel(),
    prompt: buildStoryboardImagePrompt(input),
    response_format: "url",
    size: getImageSizeForAspectRatio(input.aspectRatio),
    watermark: false,
    ...(typeof input.seed === "number" ? { seed: input.seed } : {}),
  };

  const startedAt = nowMs();
  logVolcengine("image_generation_start", {
    model: payload.model,
    size: payload.size,
    timeoutMs: VOLCENGINE_TIMEOUT_MS,
  });

  const response = await volcengineFetch("/images/generations", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const imageUrl = firstString(response?.data?.[0]?.url);
  logVolcengine("image_generation_complete", {
    model: payload.model,
    totalMs: nowMs() - startedAt,
    imageUrl: imageUrl ?? null,
  });

  if (!imageUrl) {
    throw new Error("VOLCENGINE_IMAGE_URL_MISSING");
  }

  return imageUrl;
}

export async function createVideoGenerationTaskWithVolcengine(
  input: VolcengineVideoGenerationInput,
) {
  if (!isVolcengineEnabled()) {
    return null;
  }

  const sceneDebug = input.scenes.map((scene, index) => {
    const normalizedReferenceImageUrls = (scene.referenceImageUrls ?? []).filter((value) =>
      isRemoteAssetUrl(value),
    );

    return {
      sceneIndex: index,
      sortOrder: scene.sortOrder,
      lyricLine: scene.lyricLine,
      hasPreviewImage: isRemoteAssetUrl(scene.previewImageUrl),
      previewImageUrl: summarizeAssetUrl(scene.previewImageUrl),
      hasFirstFrame: isRemoteAssetUrl(scene.firstFrameUrl),
      firstFrameUrl: summarizeAssetUrl(scene.firstFrameUrl),
      hasLastFrame: isRemoteAssetUrl(scene.lastFrameUrl),
      lastFrameUrl: summarizeAssetUrl(scene.lastFrameUrl),
      firstLastFrameSame: isSameRemoteAssetUrl(scene.firstFrameUrl, scene.lastFrameUrl),
      referenceImageCount: normalizedReferenceImageUrls.length,
      referenceImages: normalizedReferenceImageUrls.map((value) => summarizeAssetUrl(value)),
    };
  });
  const firstFrameUrl =
    input.scenes.find((scene) => isRemoteAssetUrl(scene.firstFrameUrl))?.firstFrameUrl ??
    input.scenes.find((scene) => isRemoteAssetUrl(scene.previewImageUrl))?.previewImageUrl;
  const requestedLastFrameUrl = input.scenes.find((scene) => isRemoteAssetUrl(scene.lastFrameUrl))?.lastFrameUrl;
  const lastFrameUrl =
    requestedLastFrameUrl && !isSameRemoteAssetUrl(firstFrameUrl, requestedLastFrameUrl)
      ? requestedLastFrameUrl
      : undefined;
  const useFirstLastFrameMode = Boolean(firstFrameUrl && lastFrameUrl);
  const referenceImageUrls = Array.from(
    new Set(
      [
        ...(useFirstLastFrameMode || !firstFrameUrl ? [] : [firstFrameUrl]),
        ...input.scenes.flatMap((scene) => scene.referenceImageUrls ?? []),
      ]
        .filter((value): value is string => isRemoteAssetUrl(value)),
    ),
  ).slice(0, 9);
  const content: Array<Record<string, unknown>> = [
    {
      type: "text",
      text: buildVideoPrompt(input),
    },
  ];

  if (useFirstLastFrameMode && firstFrameUrl) {
    content.push({
      type: "image_url",
      role: "first_frame",
      image_url: {
        url: firstFrameUrl,
      },
    });
  }

  if (useFirstLastFrameMode && lastFrameUrl) {
    content.push({
      type: "image_url",
      role: "last_frame",
      image_url: {
        url: lastFrameUrl,
      },
    });
  }

  if (!useFirstLastFrameMode) {
    for (const referenceImageUrl of referenceImageUrls) {
      if (referenceImageUrl === firstFrameUrl || referenceImageUrl === lastFrameUrl) {
        continue;
      }

      content.push({
        type: "image_url",
        role: "reference_image",
        image_url: {
          url: referenceImageUrl,
        },
      });
    }
  }

  if (!useFirstLastFrameMode && isRemoteAssetUrl(input.referenceAudioUrl)) {
    content.push({
      type: "audio_url",
      audio_url: {
        url: input.referenceAudioUrl,
      },
    });
  }

  const payload: Record<string, unknown> = {
    model: getVolcengineVideoModel(),
    content,
    resolution: mapResolution(input.resolution),
    ratio: normalizeAspectRatio(input.aspectRatio),
    duration: Math.max(4, Math.min(12, input.durationSec ?? 8)),
    generate_audio: Boolean(input.generateAudio),
    return_last_frame: true,
    watermark: false,
  };

  const callbackUrl = getVolcengineVideoCallbackUrl();
  if (callbackUrl) {
    payload.callback_url = callbackUrl;
  }

  const startedAt = nowMs();
  logVolcengine("video_submit_scene_inputs", {
    sceneCount: input.scenes.length,
    scenes: sceneDebug,
  });
  logVolcengine("video_submit_start", {
    model: payload.model,
    frameMode: useFirstLastFrameMode ? "first_last_frame" : "reference_image",
    useFirstLastFrameMode,
    hasFirstFrame: Boolean(firstFrameUrl),
    firstFrameUrl: summarizeAssetUrl(firstFrameUrl),
    hasLastFrame: Boolean(lastFrameUrl),
    requestedLastFrameUrl: summarizeAssetUrl(requestedLastFrameUrl),
    acceptedLastFrameUrl: summarizeAssetUrl(lastFrameUrl),
    ignoredDuplicateLastFrame: Boolean(
      requestedLastFrameUrl && isSameRemoteAssetUrl(firstFrameUrl, requestedLastFrameUrl),
    ),
    referenceImageCount: useFirstLastFrameMode ? 0 : referenceImageUrls.length,
    referenceImages: (useFirstLastFrameMode ? [] : referenceImageUrls).map((value) => summarizeAssetUrl(value)),
    hasReferenceAudio: !useFirstLastFrameMode && isRemoteAssetUrl(input.referenceAudioUrl),
    contentRoles: content.map((item) => item.role ?? item.type ?? "unknown"),
    duration: payload.duration,
    ratio: payload.ratio,
    resolution: payload.resolution,
  });

  const response = await volcengineFetch("/contents/generations/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const taskId = firstString(response?.id, response?.task_id, response?.data?.id);
  const status = firstString(response?.status, response?.data?.status) || "queued";

  logVolcengine("video_submit_complete", {
    totalMs: nowMs() - startedAt,
    taskId: taskId ?? null,
    status,
  });

  if (!taskId) {
    throw new Error("VOLCENGINE_VIDEO_TASK_ID_MISSING");
  }

  return {
    provider: "volcengine" as const,
    taskId,
    status,
  };
}

export async function getVideoGenerationTaskWithVolcengine(taskId: string) {
  const response = await volcengineFetch(
    `/contents/generations/tasks/${encodeURIComponent(taskId)}`,
    { method: "GET" },
  );

  const status = (firstString(response?.status) || "running") as VolcengineVideoTaskStatus["status"];
  const videoUrl = extractResponseUrl(response, [
    ["content", "video_url"],
    ["content", "videoUrl"],
    ["content", "video", "url"],
    ["content", "video"],
    ["data", "content", "video_url"],
    ["data", "content", "videoUrl"],
    ["data", "video_url"],
    ["data", "videoUrl"],
    ["data", "video", "url"],
    ["data", "video"],
    ["output", "video_url"],
    ["output", "videoUrl"],
    ["output", "video", "url"],
    ["output", "video"],
    ["result", "video_url"],
    ["result", "videoUrl"],
    ["result", "video", "url"],
    ["result", "video"],
    ["video_url"],
    ["videoUrl"],
    ["video", "url"],
    ["video"],
  ]);
  const lastFrameUrl = extractResponseUrl(response, [
    ["content", "last_frame_url"],
    ["content", "lastFrameUrl"],
    ["content", "last_frame", "url"],
    ["content", "lastFrame", "url"],
    ["content", "cover_url"],
    ["content", "coverUrl"],
    ["content", "poster_url"],
    ["content", "posterUrl"],
    ["content", "image_url"],
    ["content", "imageUrl"],
    ["content", "thumbnail_url"],
    ["content", "thumbnailUrl"],
    ["data", "content", "last_frame_url"],
    ["data", "content", "lastFrameUrl"],
    ["data", "last_frame_url"],
    ["data", "lastFrameUrl"],
    ["data", "cover_url"],
    ["data", "coverUrl"],
    ["data", "poster_url"],
    ["data", "posterUrl"],
    ["data", "image_url"],
    ["data", "imageUrl"],
    ["output", "last_frame_url"],
    ["output", "lastFrameUrl"],
    ["output", "cover_url"],
    ["output", "coverUrl"],
    ["output", "poster_url"],
    ["output", "posterUrl"],
    ["result", "last_frame_url"],
    ["result", "lastFrameUrl"],
    ["result", "cover_url"],
    ["result", "coverUrl"],
    ["last_frame_url"],
    ["lastFrameUrl"],
    ["cover_url"],
    ["coverUrl"],
    ["poster_url"],
    ["posterUrl"],
    ["image_url"],
    ["imageUrl"],
    ["thumbnail_url"],
    ["thumbnailUrl"],
  ]);

  return {
    provider: "volcengine" as const,
    taskId,
    status,
    videoUrl,
    lastFrameUrl,
    errorCode: firstString(response?.error?.code),
    errorMessage: firstString(response?.error?.message),
    raw: response,
  };
}

export async function previewLiveVolcengineVideoTask(
  input: VolcengineVideoGenerationInput,
) {
  const createdTask = await createVideoGenerationTaskWithVolcengine(input);
  if (!createdTask) {
    return {
      enabled: false,
      warning: "VOLCENGINE_ARK_API_KEY 未配置，无法发起真实请求",
    };
  }

  const polls: VolcengineVideoTaskStatus[] = [];

  for (let attempt = 0; attempt < VOLCENGINE_VIDEO_POLL_ATTEMPTS; attempt += 1) {
    if (attempt > 0) {
      await sleep(VOLCENGINE_VIDEO_POLL_INTERVAL_MS);
    }

    const detail = await getVideoGenerationTaskWithVolcengine(createdTask.taskId);
    polls.push(detail);

    if (["succeeded", "failed", "expired", "cancelled"].includes(detail.status)) {
      break;
    }
  }

  return {
    enabled: true,
    createdTask,
    polls,
  };
}
