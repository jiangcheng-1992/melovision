import type { ZodTypeAny } from "zod";

import { generateStoryboard, LyricsSegmenter, validateStoryboardOutput } from "@/storyboard";
import type {
  CharacterAnchor,
  GenerateStoryboardInput,
  PromptBundle,
  TimedLyricLine,
  WorldAnchor,
} from "@/storyboard";
import {
  cacheMusicOptionAudioAsset,
  deleteProjectAudioCache,
  isCacheableRemoteAudioUrl,
} from "@/lib/mv/audio-cache";
import {
  extractStoryboardPromptMetadata,
  extractStoryboardVideoPrompt,
  parseStoryboardPromptBundle,
  serializeStoryboardPromptBundle,
  updateStoryboardVideoPrompt,
} from "@/lib/mv/storyboard-prompt-package";
import { prisma } from "@/lib/prisma";

const MOCK_ARTWORKS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCS3srMndWhw7s3pl6y6pr6rShXwQvdeaq4x7Vnt8wnczqWIjowrNJGha5hKpucyff7ApwNAFr0uGDM8rgPzgH4RZ6tyijp-9Y5tNFhS1NCy-o8kj7VG03prf_o7BQ4Fzt7K-fO8wEn-vxPWsCVuNDRrVDFM-P-Ux4KrGNv0T4pjTkQdXE2Xk4gTrgU4-xP5ureNK22fHwerT6tjAVug5mUVGm-2oChkq6JgR7TeOHTfCl-gG1AgF6UfQJMyc16dOi3d4YPkKPafw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDVWcFgb6dHnuOqsmeFoWY09VFIQAgnQoAUNpOqOw7Nvdal5NN6qCjXXEl0feFE_1TUrLZMZN7TiHM1SalA1b1SmKMBss2usZW9af-oxYzYZHpaPNod9xHlz-Joxhk-QxEB4rI2JdZFalbTJOrd7SHkTe0hg31FlmvkftKaOuHESkuN-pwsWe3myvCeThqqYFLt1WWarADzS3f0UwTPlmHgs5lyGIwVVlblil6yJOIDVPGorZMQxMXvq_QG9SHP-sHVS8yMDq5x-Q",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCnwnKYLQ4d02jCoEsFSchKuA_j0D6oQ_6McYi7bEp_GtR0FnJD-nKWU_ysI5vF9B6lZqhVyHQ0PHhtaYqFUhuUMJ6eIe-wlCDUIlgGk5LLcIdo9-M-GrNnwIhModWRfabLNSo1kbKTUbjWs3tPmZmHrvOfwvr2Vz8X0mvYQ5vWae3GVjgUbACjpZeFWvemn8km4V3tbUxLw0vZUStrTDlcD0tcVfkScKFxvbqlU-Mf6jIzN0wWDUOOb9oyVv8LwLg5Vjvps8rA3g",
];

const MOCK_SCENE_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCPVl_vpL5BCVTCh1ygohCwp1dcYVNRiP16-2dxXI-18dcKbINjbZ_n5uhaUea_HmTzNPJMxsOY-GcZJnk66uFySKM6GBjg-yLRyt23aDYRk0hF7uJx2RuLDuqOTHFj4-KphKthHu-vn2VPSD2glyGt5yrlCF7oZt2iTHxKvKxRpuYaKq8QtUx8G4p6iNvpPwlq4PVn04lwipzacbC2s1htNhzzwzEFdsSIyao_ZkzTX-FVw8gVsXy98Lp-RgJxk_q3JiUy4Rm7ig",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDMZh159quZ5-GPK4tAOzXp-jaZp2X-0sAiUI1lqDUXXbYTimlD2mTnDVBrxtm7EpRWnsfRM9MYD3yE2w5xC6F0tiGnyI2iWBdoxdIMTxCPzGVUGCwYR1WfQ1lW3aJpWHCITBwhbEdR6o2_bs4Jqldzd_V65Kf7AeaELY2-i51Dt3ZLAF4XrNkscBu5v8cohhB-K9MupZzS_bfPSl5KdYE2JC16Uuq4dUa-6My1ItGV8AK98kVy10QSqcdSEuVG14C5OY-yZA07Rw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC-IFJF1uA2sILcaHTWcap0b1Zcpwk5NC4kecxksehUJOIY2mTm4AfMyjxhwXj7fUBE2JANz2ZO3xak7gWJfsML9IZK6_b39fpF4QAzQUGCpOzYyXjmr_dmYCCpZuIaaaOjfCv1saQVnQ7iKGTtXSXPzkw8Gwd4OvuYprztZdofzggUDOR2Tt3ycbx28Kv0iTkzrsFYd4nhjPrjZj_NV96lkhrGD45VraA534_5_lcJ7cHZAu4cde-Lmp915cRD5zzefnGrDL-Sqw",
];

const GENERATION_BOOT_MS = 4000;
const GENERATION_SCENE_MS = 12000;
const STORYBOARD_GENERATION_TIMEOUT_MS = 12000;
const PRIMARY_SEGMENT_CHAR_LIMIT = 18;
const RETRY_SEGMENT_CHAR_LIMIT = 14;

type CreateProjectInput = {
  title: string;
  conceptPrompt: string;
  customLyrics?: string;
  musicGenerationMode?: "song" | "instrumental";
  visualStyle: string;
  musicStyle: string;
  aspectRatio?: string;
  shotDensity?: string;
  performanceMode?: string;
  subtitleMode?: string;
  consistencyBoost?: boolean;
};

export type MusicGenerationWarningCode =
  | "suno-credits-insufficient"
  | "suno-generation-failed";

type MusicGenerationResult = {
  options: Array<{
    title: string;
    lyricSnippet: string;
    lyrics?: string;
    durationSec: number;
    bpm: number;
    genre: string;
    tags: string;
    artworkUrl: string;
    audioUrl?: string;
    provider: string;
    providerRef: string;
    isSelected: boolean;
  }>;
  source: "suno" | "mock";
  warningCode?: MusicGenerationWarningCode;
  warningMessage?: string;
};

type ExportJobInput = {
  resolution: string;
  subtitleStyle: string;
  fontSize: number;
  published: boolean;
};

type StoryboardSettingsInput = {
  styleTags: string[];
  consistencyBoost: boolean;
  transitionStyle: string;
};

type StoryboardSceneUpdateInput = {
  prompt?: string;
  lyricLine?: string;
};

type MockSunoTrack = {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl: string;
  lyricSnippet: string;
  lyrics: string;
  durationSec: number;
  bpm: number;
  genre: string;
  tags: string[];
 };

type MockSunoResponse = {
  requestId: string;
  taskId: string;
  provider: "suno";
  mode: "custom";
  status: "completed";
  createdAt: string;
  input: {
    prompt: string;
    tags: string[];
    title: string;
    customLyrics?: string;
    stylePreset: string;
  };
  data: MockSunoTrack[];
};

async function cacheProjectMusicOptionAudios(
  options: Array<{
    id: string;
    projectId: string;
    audioUrl?: string | null;
    provider: string;
  }>,
) {
  await Promise.all(
    options.map(async (option) => {
      if (option.provider !== "suno" || !isCacheableRemoteAudioUrl(option.audioUrl)) {
        return;
      }

      try {
        const cachedUrl = await cacheMusicOptionAudioAsset({
          projectId: option.projectId,
          optionId: option.id,
          sourceUrl: option.audioUrl,
        });

        if (!cachedUrl) {
          return;
        }

        await prisma.musicOption.update({
          where: { id: option.id },
          data: { audioUrl: cachedUrl },
        });
      } catch (error) {
        console.warn("[mv.workflow] audio_cache_skipped", {
          projectId: option.projectId,
          optionId: option.id,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }),
  );
}

function presentStoryboardScenePrompt<T extends { prompt: string }>(scene: T): T {
  const metadata = extractStoryboardPromptMetadata(scene.prompt);
  return {
    ...scene,
    prompt: extractStoryboardVideoPrompt(scene.prompt),
    ...(metadata
      ? {
          subtitleText: metadata.subtitleText,
          subtitleStartSec: metadata.subtitleStartSec,
          subtitleEndSec: metadata.subtitleEndSec,
          primaryCharacterId: metadata.primaryCharacterId,
          identityLock: metadata.identityLock,
        }
      : {}),
  };
}

function buildSceneSharedContext(project: {
  title: string;
  conceptPrompt: string;
  visualStyle: string;
}, scene: {
  lyricLine: string;
  continuityLine?: string | null;
}) {
  return [
    `项目：${project.title}`,
    `整体概念：${project.conceptPrompt}`,
    `视觉风格：${project.visualStyle}`,
    `当前歌词：${scene.lyricLine}`,
    scene.continuityLine ? `连续性：${scene.continuityLine}` : "连续性：首镜建立主角、空间与情绪基调。",
  ].join("\n");
}

function buildFallbackScenePromptBundle(project: {
  title: string;
  conceptPrompt: string;
  visualStyle: string;
}, scene: {
  sortOrder: number;
  lyricLine: string;
  prompt: string;
  continuityLine?: string | null;
}, continuityReferenceImageUrl?: string | null): PromptBundle {
  const videoPrompt = extractStoryboardVideoPrompt(scene.prompt);
  const subtitleText = scene.lyricLine.replace(/\s*\/\s*/g, " ").trim();
  const identityLock = continuityReferenceImageUrl
    ? "沿用上一镜真实主角外观、发型、服装主色和空间朝向，禁止换脸或新增主要人物。"
    : "首镜建立唯一主角外观、服装和空间基准，后续镜头全部沿用。";
  const coverPrompt = [
    `为 MV《${project.title}》生成第 ${scene.sortOrder + 1} 段分镜封面图。`,
    `整体风格：${project.visualStyle}`,
    `当前歌词片段：${scene.lyricLine}`,
    scene.continuityLine ? `承接上一镜：${scene.continuityLine}` : "首镜负责建立主体、空间和情绪基调。",
    continuityReferenceImageUrl
      ? "必须参考上一镜的真实尾帧或封面，保持主角外观、服装、空间方向和镜头朝向连续。"
      : "如果没有上一镜，先建立统一主角、场景和光线，不要出现占位物体。",
    "任务目标：只定格这一镜最能代表叙事推进和情绪转折的一帧。",
    `视频镜头上下文：${videoPrompt}`,
  ].join("\n");

  return {
    shared_context: buildSceneSharedContext(project, scene),
    identity_lock: identityLock,
    cover_prompt: coverPrompt,
    video_prompt: videoPrompt,
    negative_prompt:
      "text, typography, subtitles, watermark, logo, extra characters, duplicated people, malformed hands, broken limbs, fused fingers, deformed face, low consistency, sudden costume change, random location change, unrelated props, collage composition",
    subtitle_text: subtitleText,
    subtitle_start_sec: 0,
    subtitle_end_sec: 0,
    primary_character_id: "main-character",
  };
}

function resolveScenePromptBundle(project: {
  title: string;
  conceptPrompt: string;
  visualStyle: string;
}, scene: {
  sortOrder: number;
  lyricLine: string;
  prompt: string;
  continuityLine?: string | null;
}, continuityReferenceImageUrl?: string | null) {
  return (
    parseStoryboardPromptBundle(scene.prompt) ??
    buildFallbackScenePromptBundle(project, scene, continuityReferenceImageUrl)
  );
}

function isLegacyPlaceholderStoryboardScene(
  projectTitle: string,
  scene: {
    lyricLine: string;
    prompt: string;
    resultVideoUrl?: string | null;
    generationTaskId?: string | null;
    status?: string | null;
  },
) {
  if (scene.resultVideoUrl || scene.generationTaskId) {
    return false;
  }

  const lyricLine = scene.lyricLine.trim();
  const videoPrompt = extractStoryboardVideoPrompt(scene.prompt);
  const hasPromptPackage = Boolean(parseStoryboardPromptBundle(scene.prompt));

  return (
    !hasPromptPackage &&
    (lyricLine === `${projectTitle} 新增段落` ||
      videoPrompt.includes("风格新增段落") ||
      videoPrompt.includes("承接上一镜头情绪并推动故事进入下一幕"))
  );
}

function shouldRebuildStoryboardScenes(project: {
  title: string;
  scenes: Array<{
    lyricLine: string;
    prompt: string;
    resultVideoUrl?: string | null;
    generationTaskId?: string | null;
    status?: string | null;
  }>;
}) {
  if (project.scenes.length === 0) {
    return true;
  }

  if (project.scenes.length !== 1) {
    return false;
  }

  return isLegacyPlaceholderStoryboardScene(project.title, project.scenes[0]);
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseStyleTagsJson(value: string | null | undefined, fallback: string[] = []) {
  if (!value) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
    }
  } catch {
    return fallback;
  }

  return fallback;
}

function formatDuration(durationSec: number) {
  const minutes = Math.floor(durationSec / 60);
  const seconds = `${durationSec % 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function buildMockSunoTrackId(prefix: string, index: number) {
  return `${prefix}-clip-${index + 1}`;
}

function humanizeRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}分钟前更新`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}小时前更新`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}天前更新`;
}

function formatCompactMetric(value: number) {
  if (value >= 10000) {
    return `${Math.round(value / 1000)}K`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return `${value}`;
}

function getSelectedMusicOption(project: {
  selectedMusicOptionId?: string | null;
  musicOptions: Array<{
    id: string;
    isSelected?: boolean;
    durationSec: number;
    title: string;
    genre: string;
    tags: string;
    artworkUrl: string;
    audioUrl?: string | null;
  }>;
}) {
  return (
    project.musicOptions.find((item) => item.id === project.selectedMusicOptionId) ??
    project.musicOptions.find((item) => item.isSelected) ??
    project.musicOptions[0] ??
    null
  );
}

function isRemoteReferenceAssetUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return /^https?:\/\//i.test(value.trim()) && !value.includes("mock-suno.local");
}

function getContinuityReferenceScene(
  scenes: Array<{
    sortOrder: number;
    previewImageUrl?: string | null;
    resultVideoUrl?: string | null;
  }>,
  sortOrder: number,
) {
  for (let index = sortOrder - 1; index >= 0; index -= 1) {
    const matched = scenes.find((scene) => scene.sortOrder === index);
    if (!matched) {
      continue;
    }

    if (!isMockScenePreviewImage(matched.previewImageUrl)) {
      return matched;
    }
  }

  return null;
}

function buildVolcengineProgress(status: string, fallbackProgress: number) {
  if (status === "queued") return Math.max(fallbackProgress, 8);
  if (status === "running") return Math.max(fallbackProgress, 72);
  if (status === "succeeded") return 100;
  if (status === "failed" || status === "expired" || status === "cancelled") return fallbackProgress;
  return Math.max(fallbackProgress, 12);
}

function buildVolcengineCurrentScene(sceneCount: number, progress: number) {
  if (sceneCount <= 0 || progress >= 100) {
    return null;
  }

  return Math.min(sceneCount, Math.max(1, Math.ceil((progress / 100) * sceneCount)));
}

function buildMockSunoResponse(project: {
  title: string;
  conceptPrompt: string;
  customLyrics?: string | null;
  visualStyle?: string;
  musicStyle: string;
  aspectRatio?: string;
  shotDensity?: string;
  performanceMode?: string;
  subtitleMode?: string;
  consistencyBoost?: boolean;
}) : MockSunoResponse {
  const baseGenre = project.musicStyle;
  const concept = project.conceptPrompt.slice(0, 30) || project.title;
  const seed = `${project.title}-${Date.now()}`;
  const presets = [
    {
      title: `${project.title} · 霓虹主线`,
      lyricSnippet: `穿过 ${concept} 的夜色，我把心跳写成 ${baseGenre} 的节拍。`,
      durationSec: 192,
      bpm: 120,
      genre: baseGenre,
      tags: `${baseGenre},电影感,主推`,
    },
    {
      title: `${project.title} · 情绪推进版`,
      lyricSnippet: `让副歌在城市天际线升起，把故事推向更明亮的章节。`,
      durationSec: 204,
      bpm: 128,
      genre: `${baseGenre} / Anthem`,
      tags: `${baseGenre},副歌强化,流行`,
    },
    {
      title: `${project.title} · 深夜氛围版`,
      lyricSnippet: `把合成器和低频拉低一点，让画面更适合慢镜头和情绪堆叠。`,
      durationSec: 186,
      bpm: 112,
      genre: `${baseGenre} / Ambient`,
      tags: `${baseGenre},氛围感,慢热`,
    },
  ];

  return {
    requestId: `mock-suno-request-${seed}`,
    taskId: `mock-suno-task-${seed}`,
    provider: "suno",
    mode: "custom",
    status: "completed",
    createdAt: new Date().toISOString(),
    input: {
      prompt: project.conceptPrompt,
      tags: [
        project.musicStyle,
        project.visualStyle ?? "MV",
        project.aspectRatio ?? "16:9",
        project.shotDensity ?? "balanced",
        project.performanceMode ?? "cinematic",
        project.subtitleMode ?? "stylized",
        project.consistencyBoost ? "consistency-boost" : "standard-consistency",
      ],
      title: project.title,
      customLyrics: project.customLyrics ?? undefined,
      stylePreset: project.musicStyle,
    },
    data: presets.map((preset, index) => ({
      id: buildMockSunoTrackId(seed, index),
      title: preset.title,
      audioUrl: `https://mock-suno.local/audio/${buildMockSunoTrackId(seed, index)}.mp3`,
      imageUrl: MOCK_ARTWORKS[index % MOCK_ARTWORKS.length],
      lyricSnippet: preset.lyricSnippet,
      lyrics:
        project.customLyrics?.trim() ||
        `${preset.lyricSnippet}\n让画面跟着鼓点推进，进入 ${project.title} 的下一幕。`,
      durationSec: preset.durationSec,
      bpm: preset.bpm,
      genre: preset.genre,
      tags: preset.tags.split(",").map((item) => item.trim()).filter(Boolean),
    })),
  };
}

function mapMockSunoResponseToMusicOptions(response: MockSunoResponse) {
  return response.data.map((track, index) => ({
    title: track.title,
    lyricSnippet: track.lyricSnippet,
    lyrics: track.lyrics,
    durationSec: track.durationSec,
    bpm: track.bpm,
    genre: track.genre,
    tags: track.tags.join(","),
    artworkUrl: track.imageUrl,
    audioUrl: track.audioUrl,
    provider: "suno_mock",
    providerRef: track.id,
    isSelected: index === 0,
  }));
}

export function previewMockSunoResponse(input: CreateProjectInput) {
  return buildMockSunoResponse(input);
}

function getMusicGenerationWarning(error: unknown): Pick<
  MusicGenerationResult,
  "warningCode" | "warningMessage"
> | null {
  const message = error instanceof Error ? error.message : String(error);

  if (
    message.includes("credits are insufficient") ||
    message.includes("credits insufficient") ||
    message.includes("Please top up")
  ) {
    return {
      warningCode: "suno-credits-insufficient",
      warningMessage: "Suno 额度不足，当前展示的是模拟音乐候选，请充值后重试。",
    };
  }

  if (message.startsWith("SUNO_")) {
    return {
      warningCode: "suno-generation-failed",
      warningMessage: "Suno 音乐生成失败，当前展示的是模拟音乐候选，请稍后重试。",
    };
  }

  return null;
}

async function generateLyricsForSong(input: {
  title: string;
  conceptPrompt: string;
  visualStyle: string;
  musicStyle: string;
}) {
  try {
    const { optimizeStoryboardPromptWithVolcengine } = await import("@/lib/mv/volcengine");
    const content = await optimizeStoryboardPromptWithVolcengine({
      projectTitle: input.title,
      visualStyle: input.visualStyle,
      musicStyle: input.musicStyle,
      lyricLine: input.conceptPrompt,
      prompt: [
        `请根据以下 MV 创意生成一段适合中文流行歌曲演唱的歌词。`,
        `标题：${input.title}`,
        `视觉风格：${input.visualStyle}`,
        `音乐风格：${input.musicStyle}`,
        `创意描述：${input.conceptPrompt}`,
        "要求：输出 8 到 12 行中文歌词；有画面感、可唱性和情绪起伏；不要解释；不要加标题。",
      ].join("\n"),
    });

    return content?.trim() || null;
  } catch (error) {
    console.warn("[mv.workflow] lyrics_autogen_failed", {
      title: input.title,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

async function buildMusicOptionsForProject(input: {
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
}): Promise<MusicGenerationResult> {
  const startedAt = Date.now();
  const musicGenerationMode = input.musicGenerationMode ?? "song";
  const providedLyrics = input.customLyrics?.trim();
  const resolvedLyrics =
    musicGenerationMode === "song"
      ? providedLyrics ||
        (await generateLyricsForSong({
          title: input.title,
          conceptPrompt: input.conceptPrompt,
          visualStyle: input.visualStyle,
          musicStyle: input.musicStyle,
        })) ||
        [
          `${input.title} 在夜色里慢慢展开`,
          `${input.conceptPrompt.slice(0, 28)}映进心海`,
          `风把情绪吹成一段对白`,
          `让此刻节奏带我离开`,
          `光影在远方轻轻摇摆`,
          `故事沿着旋律盛开`,
          `若你听见，就别再等待`,
          `把这一刻唱成未来`,
        ].join("\n")
      : undefined;

  console.info("[mv.workflow] build_music_options:start", {
    title: input.title,
    musicStyle: input.musicStyle,
    visualStyle: input.visualStyle,
    customLyrics: Boolean(input.customLyrics?.trim()),
    aspectRatio: input.aspectRatio ?? "16:9",
    shotDensity: input.shotDensity ?? "balanced",
    performanceMode: input.performanceMode ?? "cinematic",
    musicGenerationMode,
    autoLyrics: Boolean(resolvedLyrics && !providedLyrics && musicGenerationMode === "song"),
  });

  try {
    const { generateMusicOptionsWithSuno } = await import("@/lib/mv/suno");
    const liveOptions = await generateMusicOptionsWithSuno({
      ...input,
      customLyrics: resolvedLyrics,
      musicGenerationMode,
    });
    if (liveOptions && liveOptions.length > 0) {
      const normalizedLiveOptions = liveOptions.map((option, index) => ({
        ...option,
        isSelected: index === 0,
      }));
      console.info("[mv.workflow] build_music_options:success", {
        source: "suno",
        title: input.title,
        optionCount: liveOptions.length,
        totalMs: Date.now() - startedAt,
      });
      return {
        options: normalizedLiveOptions,
        source: "suno",
      };
    }
  } catch (error) {
    const warning = getMusicGenerationWarning(error);
    console.error("[mv.workflow] build_music_options:fallback", {
      source: "mock",
      reason: error instanceof Error ? error.message : String(error),
      title: input.title,
      elapsedMs: Date.now() - startedAt,
      warningCode: warning?.warningCode ?? null,
    });

    const mockResponse = buildMockSunoResponse(input);
    const mockOptions = mapMockSunoResponseToMusicOptions(mockResponse);
    console.info("[mv.workflow] build_music_options:success", {
      source: "mock",
      title: input.title,
      optionCount: mockOptions.length,
      totalMs: Date.now() - startedAt,
    });
    return {
      options: mockOptions,
      source: "mock",
      warningCode: warning?.warningCode,
      warningMessage: warning?.warningMessage,
    };
  }

  const mockResponse = buildMockSunoResponse(input);
  const mockOptions = mapMockSunoResponseToMusicOptions(mockResponse);
  console.info("[mv.workflow] build_music_options:success", {
    source: "mock",
    title: input.title,
    optionCount: mockOptions.length,
    totalMs: Date.now() - startedAt,
  });
  return {
    options: mockOptions,
    source: "mock",
  };
}

type StoryboardSceneDraft = {
  sortOrder: number;
  startSec: number;
  endSec: number;
  lyricLine: string;
  continuityLine: string | null;
  prompt: string;
  previewImageUrl: string | null;
  status: string;
};

async function buildStoryboardScenes(project: {
  title: string;
  conceptPrompt: string;
  visualStyle: string;
  musicStyle: string;
  aspectRatio?: string | null;
  selectedMusic?: {
    durationSec: number;
    lyricSnippet?: string | null;
    lyrics?: string | null;
    genre: string;
  } | null;
}) {
  const durationSec = project.selectedMusic?.durationSec ?? 192;
  const lyrics = buildTimedLyricsForStoryboard(
    project.selectedMusic?.lyrics || project.selectedMusic?.lyricSnippet || project.conceptPrompt,
    durationSec,
  );

  const fallback = buildFallbackStoryboardScenes(project, lyrics, durationSec);

  try {
    let storyboard = await generateStoryboardWithTimeout({
      project,
      lyrics,
      maxCharsPerSegment: PRIMARY_SEGMENT_CHAR_LIMIT,
    });
    let quality = validateStoryboardOutput(storyboard);

    if (!quality.passed) {
      console.warn("[storyboard] quality_retry", {
        title: project.title,
        issues: quality.issues,
      });

      storyboard = await generateStoryboardWithTimeout({
        project,
        lyrics,
        maxCharsPerSegment: RETRY_SEGMENT_CHAR_LIMIT,
      });
      quality = validateStoryboardOutput(storyboard);
    }

    if (storyboard.scenes.length === 0) {
      return fallback;
    }

    if (!quality.passed) {
      console.warn("[storyboard] quality_fallback", {
        title: project.title,
        issues: quality.issues,
      });
      return fallback;
    }

    return storyboard.scenes.map((scene, index) => {
      const startSec = toSceneStartSecond(scene.segment.startSec);
      const endSec = toSceneEndSecond(scene.segment.endSec, durationSec, startSec);

      return {
        sortOrder: index,
        startSec,
        endSec,
        lyricLine: scene.segment.subtitleText,
        continuityLine: scene.plan.continuity_with_prev ?? null,
        prompt: serializeStoryboardPromptBundle(scene.prompts),
        previewImageUrl: null,
        status: "ready",
      };
    });
  } catch (error) {
    console.warn("[storyboard] generate_fallback", {
      title: project.title,
      error: error instanceof Error ? error.message : String(error),
    });
    return fallback;
  }
}

async function generateStoryboardWithTimeout(input: {
  project: {
    title: string;
    conceptPrompt: string;
    visualStyle: string;
    musicStyle?: string;
    aspectRatio?: string | null;
    selectedMusic?: { genre?: string | null } | null;
  };
  lyrics: TimedLyricLine[];
  maxCharsPerSegment: number;
}) {
  return Promise.race([
    generateStoryboard({
      project: {
        title: input.project.title,
        concept: input.project.conceptPrompt,
        visualStyle: input.project.visualStyle,
        musicStyle: input.project.musicStyle || input.project.selectedMusic?.genre || undefined,
        language: "zh-CN",
        aspectRatio: input.project.aspectRatio ?? "16:9",
      },
      lyrics: input.lyrics,
      characterAnchor: inferCharacterAnchor(input.project),
      worldAnchor: inferWorldAnchor(input.project),
      llm: createStoryboardLlmClient(),
      segmenterOptions: {
        maxSceneDurationSec: 8,
        minSceneDurationSec: 2.5,
        maxCharsPerSegment: input.maxCharsPerSegment,
        maxLinesPerSegment: 2,
      },
    }),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("STORYBOARD_GENERATION_TIMEOUT")), STORYBOARD_GENERATION_TIMEOUT_MS);
    }),
  ]);
}

function buildFallbackStoryboardScenes(
  project: {
    title: string;
    conceptPrompt: string;
    visualStyle: string;
  },
  lyrics: TimedLyricLine[],
  durationSec: number,
): StoryboardSceneDraft[] {
  const safeLyrics =
    lyrics.length > 0 ? lyrics : buildTimedLyricsForStoryboard(project.conceptPrompt, durationSec);
  const segments = new LyricsSegmenter().segment(safeLyrics);

  return segments.map((line, index) => {
    const previousLyric =
      index > 0 ? segments[index - 1]?.subtitleText ?? `${project.title} 开场氛围建立` : `${project.title} 开场氛围建立`;
    const nextLyric =
      index < segments.length - 1
        ? segments[index + 1]?.subtitleText ?? `${project.title} 情绪延续到下一段`
        : `${project.title} 情绪延续到下一段`;
    const continuityLine =
      index === 0
        ? null
        : `承接上一段“${previousLyric}”，过渡到下一段“${nextLyric}”，保持人物、机位和光线连续。`;

    return {
      sortOrder: index,
      startSec: toSceneStartSecond(line.startSec),
      endSec: toSceneEndSecond(line.endSec, durationSec, toSceneStartSecond(line.startSec)),
      lyricLine: line.subtitleText,
      continuityLine,
      prompt: serializeStoryboardPromptBundle(
        buildFallbackScenePromptBundle(
          project,
          {
            sortOrder: index,
            lyricLine: line.subtitleText,
            prompt: `${project.visualStyle} 风格的 MV 分镜 ${index + 1}，围绕“${project.title}”展开，画面关键词：${line.text}。${continuityLine ?? "建立主角与场景的核心氛围。"} 单段时长控制在 10 秒内，整体保持电影感、统一主角设定、镜头语言清晰。`,
            continuityLine,
          },
          index > 0 ? null : null,
        ),
      ),
      previewImageUrl: null,
      status: "ready",
    };
  });
}

function buildTimedLyricsForStoryboard(rawLyrics: string, totalDurationSec: number): TimedLyricLine[] {
  const parts = rawLyrics
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[。！？!?]/))
    .map((part) => part.trim())
    .filter(Boolean);

  const safeParts = parts.length > 0 ? parts : ["为当前 MV 生成开场氛围与情绪推进镜头。"];
  const totalWeight = safeParts.reduce((sum, part) => sum + Math.max(1, part.replace(/\s+/g, "").length), 0);
  let cursor = 0;

  return safeParts.map((text, index) => {
    const rawDuration = (Math.max(8, totalDurationSec) * Math.max(1, text.replace(/\s+/g, "").length)) / totalWeight;
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

function inferCharacterAnchor(project: {
  title: string;
  conceptPrompt: string;
  visualStyle: string;
}): CharacterAnchor {
  return {
    identity: `${project.title} 的核心主角`,
    appearance: "保持统一年龄感、脸部特征、发型和体态，不突然变脸",
    wardrobe: `延续 ${project.visualStyle} 语境下的核心服装与配饰`,
    emotionalBaseline: "情绪随歌词推进，但主体内核保持连续",
    nonNegotiables: [
      "不要出现多余角色抢占主角",
      "不要突然更换主角外观",
      "不要让服装和场景设定无理由漂移",
    ],
  };
}

function inferWorldAnchor(project: {
  conceptPrompt: string;
  visualStyle: string;
}): WorldAnchor {
  return {
    setting: `基于以下 MV 创意建立统一世界观：${project.conceptPrompt}`,
    timeOfDay: "依据歌词推进自然变化，但无明确信号时保持连续",
    lighting: `延续 ${project.visualStyle} 的统一光线语言`,
    atmosphere: "跟随音乐与歌词情绪推进，不做无理由跳变",
    continuityRules: [
      "无换场信号时不突然换地点或人物",
      "镜头应承接上一段的情绪余波和空间关系",
      "封面图和视频 prompt 使用同一份分镜上下文",
    ],
  };
}

function createStoryboardLlmClient(): GenerateStoryboardInput["llm"] {
  return {
    async invoke<TSchema extends ZodTypeAny>(systemPrompt: string, userPrompt: string, schema: TSchema) {
      try {
        const { invokeJsonWithVolcengine } = await import("@/lib/mv/volcengine");
        const result = await invokeJsonWithVolcengine({
          systemPrompt,
          userPrompt,
        });

        if (result) {
          return schema.parse(result);
        }
      } catch (error) {
        console.warn("[storyboard] llm_invoke_fallback", {
          error: error instanceof Error ? error.message : String(error),
        });
      }

      return schema.parse(buildFallbackPlanFromPrompt(userPrompt));
    },
  };
}

function buildFallbackPlanFromPrompt(userPrompt: string) {
  const lyricText =
    userPrompt.match(/- text:\s*(.+)/)?.[1]?.trim() || "当前歌词片段";
  const subtitleText =
    userPrompt.match(/- subtitleText:\s*(.+)/)?.[1]?.trim() || lyricText.replace(/\s*\/\s*/g, " ");
  const durationSec = Number(userPrompt.match(/- durationSec:\s*([0-9.]+)/)?.[1] ?? 8);
  const allowSceneBreak = userPrompt.includes("允许换场");
  const primaryCharacterId =
    userPrompt.match(/主角ID\s+([^\s；。]+)/)?.[1]?.trim() || "main-character";
  const continuityPrefix = userPrompt.match(/承接前缀：(.+)/)?.[1]?.trim();

  return {
    subtitleText,
    lyricIntent: `围绕“${subtitleText}”表达当前歌词段真正的情绪推进、关系变化或叙事意图。`,
    narrativePurpose: `围绕“${lyricText}”建立当前镜头的叙事推进，并服务整体 MV 情绪起伏。`,
    emotionalSubtext: `表达“${lyricText}”背后的潜台词与情绪流动，而非字面翻译。`,
    subject: "核心主角",
    primaryCharacterId,
    visibleCharacterIds: [primaryCharacterId],
    allowCharacterChange: false,
    characterChangeReason: undefined,
    identityGuard: "固定同一主角外观、发型、服装与空间方向，禁止无故换人。",
    subjectState: "延续上一镜的情绪与动作惯性，保持视觉主体稳定。",
    actionStart: `从“${lyricText}”对应的情绪起点进入动作。`,
    actionEnd: `在 ${Math.max(1, Math.round(durationSec))} 秒内完成当前情绪段落的动作收束。`,
    setting: allowSceneBreak ? "根据歌词信号允许切换后的新场景" : "延续上一镜的主场景关系",
    timeOfDay: allowSceneBreak ? "按歌词叙事允许自然转场后的时间" : "延续上一镜时间氛围",
    lighting: "保持统一光影与主体辨识度",
    moodTone: "电影感、情绪连贯、主体明确",
    shotType: "中近景到中景",
    cameraMovement: "轻推、跟拍或平移，避免突兀跳动",
    visualFocus: `${lyricText} 对应的主体神态、动作和空间关系`,
    coverMoment: `定格“${lyricText}”中最能代表情绪推进的一瞬`,
    continuitySummary: continuityPrefix || "承接上一镜的人物、情绪和空间关系，继续推动叙事。",
    continuity_with_prev: continuityPrefix || "承接上一镜的主体状态与空间方向，平滑过渡到当前分镜。",
    sceneChangeAllowed: allowSceneBreak,
    transitionReason: allowSceneBreak ? "歌词中存在明确换场信号。" : undefined,
    inheritedDimensions: allowSceneBreak
      ? ["character_appearance", "wardrobe", "mood_tone"]
      : ["character_appearance", "wardrobe", "setting", "lighting", "mood_tone"],
    continuityChecklist: [
      "主角外观保持一致",
      "服装和主色保持一致",
      "空间与机位自然承接",
      "光线与情绪基调延续",
    ],
  };
}

function roundStoryboardSecond(value: number) {
  return Math.round(value * 1000) / 1000;
}

function toSceneStartSecond(value: number) {
  return Math.max(0, Math.floor(value));
}

function toSceneEndSecond(value: number, totalDurationSec: number, startSec = 0) {
  const bounded = Math.min(Math.max(startSec + 1, Math.ceil(value)), Math.max(1, Math.ceil(totalDurationSec)));
  return Math.min(startSec + 10, bounded);
}

function isMockScenePreviewImage(url?: string | null) {
  if (!url) {
    return true;
  }

  return (
    MOCK_SCENE_IMAGES.includes(url) ||
    url.includes("placehold.co") ||
    url.includes("aida-public")
  );
}

async function ensureScenePreviewImage(project: {
  id: string;
  title: string;
  conceptPrompt: string;
  visualStyle: string;
}, scene: {
  id: string;
  sortOrder: number;
  lyricLine: string;
  prompt: string;
  previewImageUrl?: string | null;
  continuityLine?: string | null;
}, continuityReferenceImageUrl?: string | null) {
  if (!isMockScenePreviewImage(scene.previewImageUrl)) {
    return scene.previewImageUrl ?? null;
  }

  let fallbackPreviewUrl = null as string | null;
  if (continuityReferenceImageUrl && isRemoteReferenceAssetUrl(continuityReferenceImageUrl)) {
    fallbackPreviewUrl = continuityReferenceImageUrl;
  }

  const promptBundle = resolveScenePromptBundle(project, scene, continuityReferenceImageUrl);
  const enhancedPrompt = buildSceneCoverPrompt(project, scene, promptBundle, continuityReferenceImageUrl);

  try {
    const { generateStoryboardImageWithVolcengine } = await import("@/lib/mv/volcengine");
    const generatedImage = await generateStoryboardImageWithVolcengine({
      prompt: enhancedPrompt,
      visualStyle: project.visualStyle,
      aspectRatio: "16:9",
      seed: scene.sortOrder + 1,
    });

    if (!generatedImage) {
      return fallbackPreviewUrl;
    }

    await prisma.storyboardScene.update({
      where: { id: scene.id },
      data: {
        previewImageUrl: generatedImage,
      },
    });

    return generatedImage;
  } catch (error) {
    console.warn("[volcengine] storyboard_preview_autogen_failed", {
      projectId: project.id,
      sceneId: scene.id,
      error: error instanceof Error ? error.message : String(error),
    });

    await prisma.storyboardScene.update({
      where: { id: scene.id },
      data: {
        previewImageUrl: fallbackPreviewUrl,
      },
    });

    return fallbackPreviewUrl;
  }
}

function buildSceneCoverPrompt(
  project: {
    title: string;
    conceptPrompt: string;
    visualStyle: string;
  },
  scene: {
    sortOrder: number;
    lyricLine: string;
    prompt: string;
    continuityLine?: string | null;
  },
  promptBundle: PromptBundle,
  continuityReferenceImageUrl?: string | null,
) {
  return [
    promptBundle.shared_context,
    promptBundle.cover_prompt,
    continuityReferenceImageUrl
      ? "必须参考上一镜的真实尾帧或封面，保持主角外观、服装、空间方向和镜头朝向连续。"
      : "如果没有上一镜，先建立统一主角、场景和光线，不要出现占位物体。",
    `负向约束：${promptBundle.negative_prompt}`,
  ].join("\n");
}

async function hydrateStoryboardScenePreviews(project: NonNullable<Awaited<ReturnType<typeof getProjectForUser>>>) {
  const candidates = project.scenes.filter((scene) => isMockScenePreviewImage(scene.previewImageUrl)).slice(0, 9);

  if (candidates.length === 0) {
    return project;
  }

  void Promise.allSettled(
    candidates.map((scene) =>
      ensureScenePreviewImage(
        {
          id: project.id,
          title: project.title,
          conceptPrompt: project.conceptPrompt,
          visualStyle: project.visualStyle,
        },
        scene,
        getContinuityReferenceScene(project.scenes, scene.sortOrder)?.previewImageUrl ?? null,
      ),
    ),
  );

  return project;
}

function buildSceneDoneMessage(scene: {
  sortOrder: number;
  startSec: number;
  endSec: number;
}) {
  return `✓ 分镜 ${scene.sortOrder + 1} 已生成 (${formatDuration(scene.startSec)} - ${formatDuration(scene.endSec)})`;
}

function buildSceneActiveMessage(sceneNumber: number, sceneCount: number) {
  return `正在生成分镜 ${sceneNumber}/${sceneCount}...`;
}

function estimateGenerationProjection(sceneCount: number, elapsedMs: number) {
  if (sceneCount <= 0) {
    return {
      progress: 100,
      completedScenes: 0,
      currentSceneNumber: null,
      remainingMs: 0,
      isComplete: true,
    };
  }

  const effectiveElapsed = Math.max(0, elapsedMs - GENERATION_BOOT_MS);
  const completedScenes = Math.min(sceneCount, Math.floor(effectiveElapsed / GENERATION_SCENE_MS));

  if (completedScenes >= sceneCount) {
    return {
      progress: 100,
      completedScenes: sceneCount,
      currentSceneNumber: null,
      remainingMs: 0,
      isComplete: true,
    };
  }

  const sceneProgress =
    effectiveElapsed > 0
      ? (effectiveElapsed % GENERATION_SCENE_MS) / GENERATION_SCENE_MS
      : 0;
  const rawProgress = ((completedScenes + sceneProgress) / sceneCount) * 100;

  return {
    progress: Math.max(3, Math.min(99, Math.round(rawProgress))),
    completedScenes,
    currentSceneNumber: completedScenes + 1,
    remainingMs: Math.max(0, sceneCount * GENERATION_SCENE_MS - effectiveElapsed),
    isComplete: false,
  };
}

function slugifyFileName(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();

  return normalized || "melovision-export";
}

function buildExportPackage(project: Awaited<ReturnType<typeof getProjectForUser>>, settings: ExportJobInput) {
  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const selectedMusic =
    project.musicOptions.find((item) => item.id === project.selectedMusicOptionId) ??
    project.musicOptions.find((item) => item.isSelected) ??
    null;

  return {
    schemaVersion: "1.0.0",
    exportedAt: new Date().toISOString(),
    project: {
      id: project.id,
      title: project.title,
      conceptPrompt: project.conceptPrompt,
      customLyrics: project.customLyrics,
      visualStyle: project.visualStyle,
      musicStyle: project.musicStyle,
      status: project.status,
      generationStatus: project.generationStatus,
      generationProgress: project.generationProgress,
      coverImageUrl: project.coverImageUrl,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    },
    exportSettings: settings,
    selectedMusic: selectedMusic
      ? {
          id: selectedMusic.id,
          title: selectedMusic.title,
          lyricSnippet: selectedMusic.lyricSnippet,
          durationSec: selectedMusic.durationSec,
          bpm: selectedMusic.bpm,
          genre: selectedMusic.genre,
          tags: splitTags(selectedMusic.tags),
          artworkUrl: selectedMusic.artworkUrl,
          provider: selectedMusic.provider,
          providerRef: selectedMusic.providerRef,
        }
      : null,
    storyboard: project.scenes.map((scene) => ({
      id: scene.id,
      order: scene.sortOrder,
      startSec: scene.startSec,
      endSec: scene.endSec,
      lyricLine: scene.lyricLine,
      subtitleText: scene.subtitleText ?? scene.lyricLine,
      subtitleStartSec: scene.subtitleStartSec ?? scene.startSec,
      subtitleEndSec: scene.subtitleEndSec ?? scene.endSec,
      primaryCharacterId: scene.primaryCharacterId ?? "main-character",
      prompt: scene.prompt,
      previewImageUrl: scene.previewImageUrl,
      status: scene.status,
    })),
    subtitleTrack: buildProjectSubtitleTrack(project),
    generationLogs: project.generationLogs.map((log) => ({
      id: log.id,
      level: log.level,
      message: log.message,
      createdAt: log.createdAt.toISOString(),
    })),
  };
}

export function buildProjectSubtitleTrack(
  project: Awaited<ReturnType<typeof getProjectForUser>>,
) {
  if (!project) {
    return [];
  }

  return project.scenes.map((scene) => ({
    sceneId: scene.id,
    order: scene.sortOrder,
    text: scene.subtitleText ?? scene.lyricLine,
    startSec: scene.subtitleStartSec ?? scene.startSec,
    endSec: scene.subtitleEndSec ?? scene.endSec,
    primaryCharacterId: scene.primaryCharacterId ?? "main-character",
  }));
}

export async function createProjectWithMockMusic(userId: string, input: CreateProjectInput) {
  const musicGeneration = await buildMusicOptionsForProject(input);

  const project = await prisma.mvProject.create({
    data: {
      userId,
      title: input.title,
      conceptPrompt: input.conceptPrompt,
      customLyrics: input.customLyrics,
      visualStyle: input.visualStyle,
      musicStyle: input.musicStyle,
      status: "draft",
      musicOptions: {
        create: musicGeneration.options,
      },
    },
    include: {
      musicOptions: true,
    },
  });

  const selected = project.musicOptions.find((item) => item.isSelected);

  if (selected) {
    await prisma.mvProject.update({
      where: { id: project.id },
      data: { selectedMusicOptionId: selected.id },
    });
  }

  await cacheProjectMusicOptionAudios(
    project.musicOptions.map((option) => ({
      id: option.id,
      projectId: project.id,
      audioUrl: option.audioUrl,
      provider: option.provider,
    })),
  );

  return {
    projectId: project.id,
    musicSource: musicGeneration.source,
    warningCode: musicGeneration.warningCode,
    warningMessage: musicGeneration.warningMessage,
  };
}

export async function saveProjectDraftWithMusic(
  userId: string,
  input: CreateProjectInput,
  existingProjectId?: string,
) {
  if (!existingProjectId) {
    return createProjectWithMockMusic(userId, input);
  }

  const existing = await prisma.mvProject.findFirst({
    where: { id: existingProjectId, userId },
  });

  if (!existing) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const musicGeneration = await buildMusicOptionsForProject(input);

  const updated = await prisma.$transaction(async (tx) => {
    await deleteProjectAudioCache(existingProjectId);
    await tx.exportJob.deleteMany({
      where: { projectId: existingProjectId },
    });
    await tx.generationLog.deleteMany({
      where: { projectId: existingProjectId },
    });
    await tx.generationJob.deleteMany({
      where: { projectId: existingProjectId },
    });
    await tx.storyboardScene.deleteMany({
      where: { projectId: existingProjectId },
    });
    await tx.storyboardSettings.deleteMany({
      where: { projectId: existingProjectId },
    });
    await tx.musicOption.deleteMany({
      where: { projectId: existingProjectId },
    });

    await tx.mvProject.update({
      where: { id: existingProjectId },
      data: {
        title: input.title,
        conceptPrompt: input.conceptPrompt,
        customLyrics: input.customLyrics,
        visualStyle: input.visualStyle,
        musicStyle: input.musicStyle,
        status: "draft",
        generationStatus: "draft",
        generationProgress: 0,
        selectedMusicOptionId: null,
        coverImageUrl: null,
        generatedVideoUrl: null,
        generatedLastFrameUrl: null,
      },
    });

    await tx.musicOption.createMany({
      data: musicGeneration.options.map((option) => ({
        projectId: existingProjectId,
        title: option.title,
        lyricSnippet: option.lyricSnippet,
        lyrics: option.lyrics,
        durationSec: option.durationSec,
        bpm: option.bpm,
        genre: option.genre,
        tags: option.tags,
        artworkUrl: option.artworkUrl,
        audioUrl: option.audioUrl,
        provider: option.provider,
        providerRef: option.providerRef,
        isSelected: option.isSelected,
      })),
    });

    const project = await tx.mvProject.findUnique({
      where: { id: existingProjectId },
      include: {
        musicOptions: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    const selected = project?.musicOptions.find((item) => item.isSelected);
    if (selected) {
      await tx.mvProject.update({
        where: { id: existingProjectId },
        data: { selectedMusicOptionId: selected.id },
      });
    }

    return project;
  });

  if (updated?.musicOptions.length) {
    await cacheProjectMusicOptionAudios(
      updated.musicOptions.map((option) => ({
        id: option.id,
        projectId: existingProjectId,
        audioUrl: option.audioUrl,
        provider: option.provider,
      })),
    );
  }

  return {
    projectId: updated?.id ?? existingProjectId,
    musicSource: musicGeneration.source,
    warningCode: musicGeneration.warningCode,
    warningMessage: musicGeneration.warningMessage,
  };
}

async function getProjectRecordForUser(userId: string, projectId: string) {
  return prisma.mvProject.findFirst({
    where: {
      id: projectId,
      userId,
    },
    include: {
      musicOptions: {
        orderBy: { createdAt: "asc" },
      },
      scenes: {
        orderBy: { sortOrder: "asc" },
      },
      generationLogs: {
        orderBy: { createdAt: "asc" },
      },
      storyboardSettings: true,
    },
  });
}

function presentProjectPrompts<T extends { scenes: Array<{ prompt: string }> }>(project: T): T {
  return {
    ...project,
    scenes: project.scenes.map((scene) => presentStoryboardScenePrompt(scene)),
  };
}

export async function getProjectForUser(userId: string, projectId: string) {
  const project = await getProjectRecordForUser(userId, projectId);
  return project ? presentProjectPrompts(project) : null;
}

async function ensureStoryboardSettingsRecord(projectId: string, visualStyle: string) {
  const existing = await prisma.storyboardSettings.findUnique({
    where: { projectId },
  });

  if (existing) {
    return existing;
  }

  return prisma.storyboardSettings.create({
    data: {
      projectId,
      styleTagsJson: JSON.stringify([visualStyle]),
      consistencyBoost: true,
      transitionStyle: "平滑淡入淡出 (Crossfade)",
    },
  });
}

export async function regenerateMusicOptions(userId: string, projectId: string) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  await deleteProjectAudioCache(projectId);
  await prisma.musicOption.deleteMany({
    where: { projectId },
  });

  const musicGeneration = await buildMusicOptionsForProject(project);

  const createdOptions = await Promise.all(
    musicGeneration.options.map((option) =>
      prisma.musicOption.create({
        data: {
          projectId,
          ...option,
        },
      }),
    ),
  );

  await prisma.mvProject.update({
    where: { id: projectId },
    data: {
      selectedMusicOptionId: createdOptions[0]?.id ?? null,
      status: "draft",
    },
  });

  await cacheProjectMusicOptionAudios(
    createdOptions.map((option) => ({
      id: option.id,
      projectId,
      audioUrl: option.audioUrl,
      provider: option.provider,
    })),
  );

  return {
    musicSource: musicGeneration.source,
    warningCode: musicGeneration.warningCode,
    warningMessage: musicGeneration.warningMessage,
  };
}

export async function selectMusicOption(userId: string, projectId: string, optionId: string) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
    include: { musicOptions: true },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const matched = project.musicOptions.find((item) => item.id === optionId);

  if (!matched) {
    throw new Error("OPTION_NOT_FOUND");
  }

  await prisma.$transaction([
    prisma.musicOption.updateMany({
      where: { projectId },
      data: { isSelected: false },
    }),
    prisma.musicOption.update({
      where: { id: optionId },
      data: { isSelected: true },
    }),
    prisma.mvProject.update({
      where: { id: projectId },
      data: {
        selectedMusicOptionId: optionId,
        status: "music_ready",
      },
    }),
  ]);
}

export async function ensureStoryboardScenes(userId: string, projectId: string) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
    include: {
      musicOptions: true,
      scenes: true,
    },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  await ensureStoryboardSettingsRecord(projectId, project.visualStyle);

  const shouldRebuild = shouldRebuildStoryboardScenes(project);
  if (project.scenes.length > 0 && !shouldRebuild) {
    return project;
  }

  const selectedMusic =
    project.musicOptions.find((item) => item.id === project.selectedMusicOptionId) ??
    project.musicOptions.find((item) => item.isSelected) ??
    null;

  const scenes = await buildStoryboardScenes({
    ...project,
    selectedMusic,
  });

  await prisma.$transaction(async (tx) => {
    if (shouldRebuild && project.scenes.length > 0) {
      await tx.storyboardScene.deleteMany({
        where: { projectId },
      });
    }

    await tx.mvProject.update({
      where: { id: projectId },
      data: {
        status: "storyboard_ready",
        scenes: {
          create: scenes,
        },
        coverImageUrl: scenes[0]?.previewImageUrl ?? null,
      },
    });
  });

  return getProjectForUser(userId, projectId);
}

export async function getStoryboardStateForUser(userId: string, projectId: string) {
  const syncedProject = await syncStoryboardSceneVideosForUser(userId, projectId);

  if (!syncedProject) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const project = await hydrateStoryboardScenePreviews(syncedProject);

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const settings = await ensureStoryboardSettingsRecord(projectId, project.visualStyle);

  return {
    scenes: project.scenes.map((scene) => presentStoryboardScenePrompt(scene)),
    settings: {
      styleTags: parseStyleTagsJson(settings.styleTagsJson, [project.visualStyle]),
      consistencyBoost: settings.consistencyBoost,
      transitionStyle: settings.transitionStyle,
      updatedAt: settings.updatedAt,
    },
  };
}

async function syncStoryboardSceneVideosForUser(userId: string, projectId: string) {
  const project = await getProjectRecordForUser(userId, projectId);

  if (!project) {
    return null;
  }

  const activeScenes = project.scenes.filter(
    (scene) =>
      scene.generationTaskId &&
      (scene.status === "queued" || scene.status === "processing"),
  );

  if (activeScenes.length === 0) {
    return project;
  }

  try {
    const { getVideoGenerationTaskWithVolcengine } = await import("@/lib/mv/volcengine");

    for (const scene of activeScenes) {
      const detail = await getVideoGenerationTaskWithVolcengine(scene.generationTaskId!);

      if (detail.status === "succeeded") {
        await prisma.$transaction(async (tx) => {
          await tx.storyboardScene.update({
            where: { id: scene.id },
            data: {
              status: "completed",
              resultVideoUrl: detail.videoUrl ?? null,
              previewImageUrl: detail.lastFrameUrl ?? scene.previewImageUrl,
            },
          });

          if (scene.sortOrder === 0 && detail.lastFrameUrl) {
            await tx.mvProject.update({
              where: { id: projectId },
              data: {
                coverImageUrl: detail.lastFrameUrl,
              },
            });
          }
        });
        continue;
      }

      if (detail.status === "failed" || detail.status === "expired" || detail.status === "cancelled") {
        await prisma.storyboardScene.update({
          where: { id: scene.id },
          data: {
            status: "failed",
          },
        });
        continue;
      }

      await prisma.storyboardScene.update({
        where: { id: scene.id },
        data: {
          status: "processing",
        },
      });
    }
  } catch (error) {
    console.warn("[volcengine] storyboard_video_sync_failed", {
      projectId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return getProjectRecordForUser(userId, projectId);
}

export async function updateStoryboardScene(
  userId: string,
  projectId: string,
  sceneId: string,
  input: StoryboardSceneUpdateInput,
) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const scene = await prisma.storyboardScene.findFirst({
    where: {
      id: sceneId,
      projectId,
    },
  });

  if (!scene) {
    throw new Error("SCENE_NOT_FOUND");
  }

  const updated = await prisma.storyboardScene.update({
    where: { id: sceneId },
    data: {
      prompt:
        typeof input.prompt === "string"
          ? updateStoryboardVideoPrompt(scene.prompt, input.prompt)
          : scene.prompt,
      lyricLine: input.lyricLine ?? scene.lyricLine,
      continuityLine: input.lyricLine
        ? `承接上一段镜头情绪，并自然过渡到围绕“${input.lyricLine}”的新镜头段落。`
        : scene.continuityLine,
    },
  });

  return presentStoryboardScenePrompt(updated);
}

export async function optimizeStoryboardScene(userId: string, projectId: string, sceneId: string) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
    include: {
      scenes: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const scene = project.scenes.find((item) => item.id === sceneId);
  if (!scene) {
    throw new Error("SCENE_NOT_FOUND");
  }

  const editablePrompt = extractStoryboardVideoPrompt(scene.prompt);
  let optimizedPrompt = `${editablePrompt}\n强化主体动作连续性、镜头景别层次和光影对比，保持 ${project.visualStyle} 的统一美术语言，并让转场更贴合音乐节奏。`;

  try {
    const { optimizeStoryboardPromptWithVolcengine } = await import("@/lib/mv/volcengine");
    const generatedPrompt = await optimizeStoryboardPromptWithVolcengine({
      projectTitle: project.title,
      visualStyle: project.visualStyle,
      musicStyle: project.musicStyle,
      lyricLine: scene.lyricLine,
      prompt: editablePrompt,
    });

    if (generatedPrompt) {
      optimizedPrompt = generatedPrompt;
    }
  } catch (error) {
    console.warn("[volcengine] storyboard_optimize_fallback", {
      projectId,
      sceneId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const updated = await prisma.storyboardScene.update({
    where: { id: sceneId },
    data: {
      prompt: updateStoryboardVideoPrompt(scene.prompt, optimizedPrompt),
      continuityLine:
        scene.continuityLine ??
        `保持当前人物和镜头运动连续，并让当前段落自然衔接到下一段。`,
    },
  });

  return presentStoryboardScenePrompt(updated);
}

export async function regenerateStoryboardScene(userId: string, projectId: string, sceneId: string) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
    include: {
      musicOptions: true,
      scenes: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const scene = project.scenes.find((item) => item.id === sceneId);
  if (!scene) {
    throw new Error("SCENE_NOT_FOUND");
  }

  const selectedMusic = getSelectedMusicOption(project);
  const regeneratedScenes = await buildStoryboardScenes({
    title: project.title,
    conceptPrompt: project.conceptPrompt,
    visualStyle: project.visualStyle,
    musicStyle: project.musicStyle,
    aspectRatio: "16:9",
    selectedMusic,
  });
  const regeneratedScene = regeneratedScenes.find((item) => item.sortOrder === scene.sortOrder);
  const nextPrompt =
    regeneratedScene?.prompt ??
    updateStoryboardVideoPrompt(
      scene.prompt,
      `${extractStoryboardVideoPrompt(scene.prompt)}\n已按当前音乐节奏重新优化镜头推进与画面调度。`,
    );
  const nextLyricLine = regeneratedScene?.lyricLine ?? scene.lyricLine;
  const nextContinuityLine = regeneratedScene?.continuityLine ?? scene.continuityLine;
  const previousScene = getContinuityReferenceScene(project.scenes, scene.sortOrder);
  let previewImageUrl =
    previousScene?.previewImageUrl && isRemoteReferenceAssetUrl(previousScene.previewImageUrl)
      ? previousScene.previewImageUrl
      : null;

  try {
    previewImageUrl = await ensureScenePreviewImage(
      {
        id: project.id,
        title: project.title,
        conceptPrompt: project.conceptPrompt,
        visualStyle: project.visualStyle,
      },
      {
        id: scene.id,
        sortOrder: scene.sortOrder,
        lyricLine: nextLyricLine,
        prompt: nextPrompt,
        continuityLine: nextContinuityLine,
        previewImageUrl: scene.previewImageUrl,
      },
      previousScene?.previewImageUrl ?? null,
    );
  } catch (error) {
    console.warn("[volcengine] storyboard_regenerate_fallback", {
      projectId,
      sceneId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const updated = await prisma.storyboardScene.update({
    where: { id: sceneId },
    data: {
      prompt: nextPrompt,
      lyricLine: nextLyricLine,
      continuityLine: nextContinuityLine,
      startSec: regeneratedScene?.startSec ?? scene.startSec,
      endSec: regeneratedScene?.endSec ?? scene.endSec,
      previewImageUrl,
      status: "ready",
      resultVideoUrl: null,
      generationTaskId: null,
    },
  });

  return presentStoryboardScenePrompt(updated);
}

export async function generateStoryboardSceneVideo(
  userId: string,
  projectId: string,
  sceneId: string,
) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
    include: {
      scenes: {
        orderBy: { sortOrder: "asc" },
      },
      musicOptions: true,
    },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const scene = project.scenes.find((item) => item.id === sceneId);
  if (!scene) {
    throw new Error("SCENE_NOT_FOUND");
  }

  const previousScene = getContinuityReferenceScene(project.scenes, scene.sortOrder);
  const selectedMusic = getSelectedMusicOption(project);
  const promptBundle = resolveScenePromptBundle(
    {
      title: project.title,
      conceptPrompt: project.conceptPrompt,
      visualStyle: project.visualStyle,
    },
    scene,
    previousScene?.previewImageUrl ?? null,
  );
  const resolvedPreviewImageUrl = await ensureScenePreviewImage(
    {
      id: project.id,
      title: project.title,
      conceptPrompt: project.conceptPrompt,
      visualStyle: project.visualStyle,
    },
    scene,
    previousScene?.previewImageUrl ?? null,
  );

  try {
    const { createVideoGenerationTaskWithVolcengine } = await import("@/lib/mv/volcengine");
    const task = await createVideoGenerationTaskWithVolcengine({
      title: `${project.title} Scene ${scene.sortOrder + 1}`,
      conceptPrompt: `${project.conceptPrompt}\n当前分镜：${scene.lyricLine}\n${scene.continuityLine ?? ""}`,
      visualStyle: project.visualStyle,
      musicStyle: project.musicStyle,
      scenes: [
        {
          sortOrder: scene.sortOrder,
          prompt: promptBundle.video_prompt,
          videoPrompt: promptBundle.video_prompt,
          sharedContext: promptBundle.shared_context,
          identityLock: promptBundle.identity_lock,
          negativePrompt: promptBundle.negative_prompt,
          continuityLine: scene.continuityLine,
          lyricLine: scene.lyricLine,
          subtitleText: promptBundle.subtitle_text,
          previewImageUrl: resolvedPreviewImageUrl,
          firstFrameUrl:
            previousScene?.previewImageUrl && isRemoteReferenceAssetUrl(previousScene.previewImageUrl)
              ? previousScene.previewImageUrl
              : resolvedPreviewImageUrl,
          lastFrameUrl: resolvedPreviewImageUrl,
          referenceImageUrls: [
            previousScene?.previewImageUrl,
            resolvedPreviewImageUrl,
          ].filter((value): value is string => isRemoteReferenceAssetUrl(value)),
        },
      ],
      aspectRatio: "16:9",
      durationSec: Math.min(10, Math.max(4, scene.endSec - scene.startSec)),
      resolution: project.exportResolution,
      generateAudio: true,
      referenceAudioUrl:
        selectedMusic && isRemoteReferenceAssetUrl(selectedMusic.audioUrl)
          ? selectedMusic.audioUrl
          : null,
    });

    if (!task) {
      throw new Error("VOLCENGINE_NOT_ENABLED");
    }

    const updated = await prisma.storyboardScene.update({
      where: { id: sceneId },
      data: {
        status: task.status === "queued" ? "queued" : "processing",
        generationTaskId: task.taskId,
        resultVideoUrl: null,
        previewImageUrl: resolvedPreviewImageUrl,
      },
    });

    await prisma.generationLog.create({
      data: {
        projectId,
        level: "info",
        message: `已提交分镜 ${scene.sortOrder + 1} 视频任务（${selectedMusic?.title ?? "未命名音乐"}）`,
      },
    });

    return presentStoryboardScenePrompt(updated);
  } catch (error) {
    await prisma.storyboardScene.update({
      where: { id: sceneId },
      data: {
        status: "failed",
      },
    });

    throw error;
  }
}

export async function addStoryboardScene(userId: string, projectId: string) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
    include: {
      scenes: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const lastScene = project.scenes[project.scenes.length - 1];
  const startSec = lastScene ? lastScene.endSec : 0;
  const endSec = startSec + 10;
  const sortOrder = lastScene ? lastScene.sortOrder + 1 : 0;

  const created = await prisma.storyboardScene.create({
    data: {
      projectId,
      sortOrder,
      startSec,
      endSec,
      lyricLine: `${project.title} 新增段落`,
      continuityLine: "承接上一镜头情绪并推动故事进入下一幕，保持视觉主体与构图连续。",
      prompt: serializeStoryboardPromptBundle(
        buildFallbackScenePromptBundle(
          {
            title: project.title,
            conceptPrompt: project.conceptPrompt,
            visualStyle: project.visualStyle,
          },
          {
            sortOrder,
            lyricLine: `${project.title} 新增段落`,
            prompt: `${project.visualStyle} 风格新增段落，承接上一镜头情绪并推动故事进入下一幕，单段时长不超过 10 秒。`,
            continuityLine: "承接上一镜头情绪并推动故事进入下一幕，保持视觉主体与构图连续。",
          },
          lastScene?.previewImageUrl ?? null,
        ),
      ),
      previewImageUrl:
        lastScene?.previewImageUrl ?? MOCK_SCENE_IMAGES[sortOrder % MOCK_SCENE_IMAGES.length],
      status: "ready",
    },
  });

  return presentStoryboardScenePrompt(created);
}

export async function deleteStoryboardScene(userId: string, projectId: string, sceneId: string) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
    include: {
      scenes: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  if (project.scenes.length <= 1) {
    throw new Error("SCENE_MINIMUM_REQUIRED");
  }

  const targetScene = project.scenes.find((scene) => scene.id === sceneId);
  if (!targetScene) {
    throw new Error("SCENE_NOT_FOUND");
  }

  await prisma.$transaction(async (tx) => {
    await tx.storyboardScene.delete({
      where: { id: sceneId },
    });

    const remaining = project.scenes
      .filter((scene) => scene.id !== sceneId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    for (const [index, scene] of remaining.entries()) {
      await tx.storyboardScene.update({
        where: { id: scene.id },
        data: { sortOrder: index },
      });
    }
  });
}

export async function updateStoryboardSettings(
  userId: string,
  projectId: string,
  input: StoryboardSettingsInput,
) {
  const project = await prisma.mvProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  await ensureStoryboardSettingsRecord(projectId, project.visualStyle);

  return prisma.storyboardSettings.update({
    where: { projectId },
    data: {
      styleTagsJson: JSON.stringify(input.styleTags),
      consistencyBoost: input.consistencyBoost,
      transitionStyle: input.transitionStyle,
    },
  });
}

async function getGenerationJobRecordForUser(userId: string, projectId: string, jobId: string) {
  return prisma.generationJob.findFirst({
    where: {
      id: jobId,
      projectId,
      project: {
        userId,
      },
    },
    include: {
      logs: {
        orderBy: { createdAt: "asc" },
      },
      project: {
        include: {
          scenes: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });
}

function buildGenerationSnapshot(
  record: NonNullable<Awaited<ReturnType<typeof getGenerationJobRecordForUser>>>,
) {
  const startedAt = record.startedAt ?? record.createdAt;
  const projection = estimateGenerationProjection(
    record.totalScenes || record.project.scenes.length,
    Date.now() - startedAt.getTime(),
  );
  const currentSceneNumber =
    record.provider === "volcengine"
      ? buildVolcengineCurrentScene(record.totalScenes || record.project.scenes.length, record.progress)
      : projection.currentSceneNumber;
  const estimatedRemainingMs =
    record.provider === "volcengine"
      ? record.status === "completed" || record.status === "cancelled"
        ? 0
        : 30000
      : projection.remainingMs;

  return {
    project: {
      id: record.project.id,
      title: record.project.title,
      status: record.project.status,
      generationStatus: record.project.generationStatus,
      generationProgress: record.project.generationProgress,
      coverImageUrl: record.project.coverImageUrl,
      generatedVideoUrl: record.project.generatedVideoUrl,
      generatedLastFrameUrl: record.project.generatedLastFrameUrl,
      exportReady: record.project.generationStatus === "completed",
    },
    job: {
      id: record.id,
      status: record.status,
      provider: record.provider,
      providerTaskId: record.providerTaskId,
      progress: record.progress,
      totalScenes: record.totalScenes,
      completedScenes: record.completedScenes,
      resultVideoUrl: record.resultVideoUrl,
      resultLastFrameUrl: record.resultLastFrameUrl,
      startedAt: startedAt.toISOString(),
      completedAt: record.completedAt?.toISOString() ?? null,
      cancelledAt: record.cancelledAt?.toISOString() ?? null,
      errorMessage: record.errorMessage,
      currentSceneNumber:
        record.status === "completed" || record.status === "cancelled"
          ? null
          : currentSceneNumber,
      estimatedRemainingMs:
        record.status === "completed" || record.status === "cancelled"
          ? 0
          : estimatedRemainingMs,
    },
    scenes: record.project.scenes.map((scene) => ({
      id: scene.id,
      sortOrder: scene.sortOrder,
      startSec: scene.startSec,
      endSec: scene.endSec,
      previewImageUrl: scene.previewImageUrl,
      status: scene.status,
    })),
    logs: record.logs.map((log) => ({
      id: log.id,
      level: log.level,
      message: log.message,
      createdAt: log.createdAt.toISOString(),
    })),
  };
}

async function syncGenerationJobForUser(userId: string, projectId: string, jobId: string) {
  const job = await getGenerationJobRecordForUser(userId, projectId, jobId);

  if (!job) {
    throw new Error("GENERATION_JOB_NOT_FOUND");
  }

  if (job.status === "completed" || job.status === "cancelled" || job.status === "failed") {
    return buildGenerationSnapshot(job);
  }

  if (job.provider === "volcengine" && job.providerTaskId) {
    try {
      const { getVideoGenerationTaskWithVolcengine } = await import("@/lib/mv/volcengine");
      const detail = await getVideoGenerationTaskWithVolcengine(job.providerTaskId);
      const nextProgress = buildVolcengineProgress(detail.status, job.progress);
      const sceneCount = job.project.scenes.length;

      await prisma.$transaction(async (tx) => {
        await tx.generationLog.deleteMany({
          where: {
            jobId: job.id,
            level: "active",
          },
        });

        if (detail.status === "succeeded") {
          await tx.generationLog.create({
            data: {
              projectId,
              jobId: job.id,
              level: "done",
              message: "✓ 火山引擎视频生成完成，已进入导出阶段",
            },
          });

          await tx.generationJob.update({
            where: { id: job.id },
            data: {
              status: "completed",
              progress: 100,
              totalScenes: sceneCount,
              completedScenes: sceneCount,
              completedAt: new Date(),
              errorMessage: null,
              resultVideoUrl: detail.videoUrl ?? null,
              resultLastFrameUrl: detail.lastFrameUrl ?? null,
            },
          });

          await tx.mvProject.update({
            where: { id: projectId },
            data: {
              status: "completed",
              generationStatus: "completed",
              generationProgress: 100,
              generatedVideoUrl: detail.videoUrl ?? null,
              generatedLastFrameUrl: detail.lastFrameUrl ?? null,
              coverImageUrl:
                detail.lastFrameUrl ??
                job.project.scenes[0]?.previewImageUrl ??
                job.project.coverImageUrl,
            },
          });

          return;
        }

        if (detail.status === "failed" || detail.status === "expired" || detail.status === "cancelled") {
          await tx.generationLog.create({
            data: {
              projectId,
              jobId: job.id,
              level: "done",
              message: `火山引擎视频任务失败：${detail.errorMessage || detail.status}`,
            },
          });

          await tx.generationJob.update({
            where: { id: job.id },
            data: {
              status: "failed",
              errorMessage: detail.errorMessage || detail.status,
            },
          });

          await tx.mvProject.update({
            where: { id: projectId },
            data: {
              status: "failed",
              generationStatus: "failed",
              generationProgress: nextProgress,
            },
          });

          return;
        }

        await tx.generationLog.create({
          data: {
            projectId,
            jobId: job.id,
            level: "active",
            message: `火山引擎视频生成中（${detail.status}）...`,
          },
        });

        await tx.generationJob.update({
          where: { id: job.id },
          data: {
            status: "processing",
            progress: nextProgress,
            totalScenes: sceneCount,
            completedScenes: Math.max(
              job.completedScenes,
              buildVolcengineCurrentScene(sceneCount, nextProgress) ?? 0,
            ),
            errorMessage: null,
          },
        });

        await tx.mvProject.update({
          where: { id: projectId },
          data: {
            status: "generating",
            generationStatus: "processing",
            generationProgress: nextProgress,
          },
        });
      });

      const refreshed = await getGenerationJobRecordForUser(userId, projectId, jobId);
      if (!refreshed) {
        throw new Error("GENERATION_JOB_NOT_FOUND");
      }

      return buildGenerationSnapshot(refreshed);
    } catch (error) {
      console.warn("[volcengine] generation_sync_fallback", {
        projectId,
        jobId,
        providerTaskId: job.providerTaskId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const startedAt = job.startedAt ?? job.createdAt;
  const sceneCount = job.project.scenes.length;
  const projection = estimateGenerationProjection(sceneCount, Date.now() - startedAt.getTime());
  const nextCompletedScenes = Math.max(job.completedScenes, projection.completedScenes);

  await prisma.$transaction(async (tx) => {
    if (nextCompletedScenes > job.completedScenes) {
      await tx.generationLog.createMany({
        data: job.project.scenes
          .slice(job.completedScenes, nextCompletedScenes)
          .map((scene) => ({
            projectId,
            jobId: job.id,
            level: "done",
            message: buildSceneDoneMessage(scene),
          })),
      });
    }

    await tx.generationLog.deleteMany({
      where: {
        jobId: job.id,
        level: "active",
      },
    });

    if (projection.isComplete) {
      await tx.generationLog.create({
        data: {
          projectId,
          jobId: job.id,
          level: "done",
          message: "✓ 全部分镜渲染完成，已进入导出阶段",
        },
      });

      await tx.generationJob.update({
        where: { id: job.id },
        data: {
          status: "completed",
          progress: 100,
          totalScenes: sceneCount,
          completedScenes: sceneCount,
          completedAt: new Date(),
          errorMessage: null,
        },
      });

      await tx.mvProject.update({
        where: { id: projectId },
        data: {
          status: "completed",
          generationStatus: "completed",
          generationProgress: 100,
          coverImageUrl: job.project.scenes[0]?.previewImageUrl ?? job.project.coverImageUrl,
        },
      });

      return;
    }

    await tx.generationLog.create({
      data: {
        projectId,
        jobId: job.id,
        level: "active",
        message: buildSceneActiveMessage(
          projection.currentSceneNumber ?? Math.min(sceneCount, nextCompletedScenes + 1),
          sceneCount,
        ),
      },
    });

    await tx.generationJob.update({
      where: { id: job.id },
      data: {
        status: "processing",
        progress: Math.max(job.progress, projection.progress),
        totalScenes: sceneCount,
        completedScenes: nextCompletedScenes,
        errorMessage: null,
      },
    });

    await tx.mvProject.update({
      where: { id: projectId },
      data: {
        status: "generating",
        generationStatus: "processing",
        generationProgress: Math.max(job.progress, projection.progress),
      },
    });
  });

  const refreshed = await getGenerationJobRecordForUser(userId, projectId, jobId);
  if (!refreshed) {
    throw new Error("GENERATION_JOB_NOT_FOUND");
  }

  return buildGenerationSnapshot(refreshed);
}

export async function getLatestGenerationJobForUser(userId: string, projectId: string) {
  const latest = await prisma.generationJob.findFirst({
    where: {
      projectId,
      project: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!latest) {
    return null;
  }

  return syncGenerationJobForUser(userId, projectId, latest.id);
}

export async function createGenerationJob(userId: string, projectId: string) {
  const ensuredProject = await ensureStoryboardScenes(userId, projectId);

  if (!ensuredProject) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const existing = await prisma.generationJob.findFirst({
    where: {
      projectId,
      project: {
        userId,
      },
      status: {
        in: ["pending", "processing"],
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (existing) {
    return syncGenerationJobForUser(userId, projectId, existing.id);
  }

  const currentProject = await getProjectRecordForUser(userId, projectId);
  if (!currentProject) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const hydratedProject = await hydrateStoryboardScenePreviews(currentProject);
  if (!hydratedProject) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  if (currentProject.generationStatus === "completed") {
    const completedJob = await prisma.generationJob.findFirst({
      where: {
        projectId,
        project: {
          userId,
        },
        status: "completed",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (completedJob) {
      return syncGenerationJobForUser(userId, projectId, completedJob.id);
    }
  }

  let provider: "mock" | "volcengine" = "mock";
  let providerTaskId: string | null = null;
  let startingProgress = 3;

  try {
    const { createVideoGenerationTaskWithVolcengine } = await import("@/lib/mv/volcengine");
    const selectedMusic = getSelectedMusicOption(hydratedProject);
    const volcTask = await createVideoGenerationTaskWithVolcengine({
      title: hydratedProject.title,
      conceptPrompt: hydratedProject.conceptPrompt,
      visualStyle: hydratedProject.visualStyle,
      musicStyle: hydratedProject.musicStyle,
      scenes: hydratedProject.scenes.map((scene, index, scenes) => {
        const promptBundle = resolveScenePromptBundle(
          {
            title: hydratedProject.title,
            conceptPrompt: hydratedProject.conceptPrompt,
            visualStyle: hydratedProject.visualStyle,
          },
          scene,
          getContinuityReferenceScene(scenes, scene.sortOrder)?.previewImageUrl ?? null,
        );

        return {
          sortOrder: scene.sortOrder,
          prompt: promptBundle.video_prompt,
          videoPrompt: promptBundle.video_prompt,
          sharedContext: promptBundle.shared_context,
          identityLock: promptBundle.identity_lock,
          negativePrompt: promptBundle.negative_prompt,
          continuityLine: scene.continuityLine,
          lyricLine: scene.lyricLine,
          subtitleText: promptBundle.subtitle_text,
          previewImageUrl: scene.previewImageUrl,
          firstFrameUrl:
            index === 0
              ? scene.previewImageUrl
              : getContinuityReferenceScene(scenes, scene.sortOrder)?.previewImageUrl ??
                scene.previewImageUrl,
          referenceImageUrls: scenes
            .slice(Math.max(0, index - 1), Math.min(scenes.length, index + 2))
            .map((item) => item.previewImageUrl)
            .filter((value): value is string => isRemoteReferenceAssetUrl(value)),
        };
      }),
      aspectRatio: "16:9",
      durationSec: Math.min(12, Math.max(4, selectedMusic?.durationSec ?? 8)),
      resolution: hydratedProject.exportResolution,
      generateAudio: true,
      referenceAudioUrl:
        selectedMusic && isRemoteReferenceAssetUrl(selectedMusic.audioUrl)
          ? selectedMusic.audioUrl
          : null,
    });

    if (volcTask) {
      provider = "volcengine";
      providerTaskId = volcTask.taskId;
      startingProgress = buildVolcengineProgress(volcTask.status, 5);
    }
  } catch (error) {
    console.warn("[volcengine] generation_create_fallback", {
      projectId,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const job = await prisma.$transaction(async (tx) => {
    await tx.mvProject.update({
      where: { id: projectId },
      data: {
        status: "generating",
        generationStatus: "processing",
        generationProgress: startingProgress,
      },
    });

    const createdJob = await tx.generationJob.create({
      data: {
        projectId,
        status: "processing",
        provider,
        providerTaskId,
        progress: startingProgress,
        totalScenes: currentProject.scenes.length,
        completedScenes: 0,
        startedAt: new Date(),
      },
    });

    await tx.generationLog.create({
      data: {
        projectId,
        jobId: createdJob.id,
        level: "active",
        message:
          provider === "volcengine"
            ? `火山引擎视频任务已提交，正在排队/生成中（task: ${providerTaskId?.slice(-8) || "n/a"}）`
            : buildSceneActiveMessage(1, currentProject.scenes.length),
      },
    });

    return createdJob;
  });

  return syncGenerationJobForUser(userId, projectId, job.id);
}

export async function getOrStartGenerationJobForUser(userId: string, projectId: string) {
  const latest = await getLatestGenerationJobForUser(userId, projectId);
  if (latest) {
    return latest;
  }

  return createGenerationJob(userId, projectId);
}

export async function getGenerationJobForUser(userId: string, projectId: string, jobId: string) {
  return syncGenerationJobForUser(userId, projectId, jobId);
}

export async function cancelGenerationJobForUser(userId: string, projectId: string, jobId: string) {
  const job = await getGenerationJobRecordForUser(userId, projectId, jobId);

  if (!job) {
    throw new Error("GENERATION_JOB_NOT_FOUND");
  }

  if (job.status === "completed") {
    return buildGenerationSnapshot(job);
  }

  await prisma.$transaction(async (tx) => {
    await tx.generationLog.deleteMany({
      where: {
        jobId,
        level: "active",
      },
    });

    await tx.generationLog.create({
      data: {
        projectId,
        jobId,
        level: "done",
        message: "生成任务已取消，已返回分镜工作台。",
      },
    });

    await tx.generationJob.update({
      where: { id: jobId },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });

    await tx.mvProject.update({
      where: { id: projectId },
      data: {
        status: "storyboard_ready",
        generationStatus: "cancelled",
      },
    });
  });

  const refreshed = await getGenerationJobRecordForUser(userId, projectId, jobId);
  if (!refreshed) {
    throw new Error("GENERATION_JOB_NOT_FOUND");
  }

  return buildGenerationSnapshot(refreshed);
}

export async function startGeneration(userId: string, projectId: string) {
  return getOrStartGenerationJobForUser(userId, projectId);
}

export async function completeGeneration(userId: string, projectId: string) {
  const latest = await getLatestGenerationJobForUser(userId, projectId);

  if (!latest) {
    throw new Error("GENERATION_JOB_NOT_FOUND");
  }

  if (latest.job.status !== "completed") {
    throw new Error("GENERATION_NOT_COMPLETED");
  }

  return latest;
}

export async function createExportJob(
  userId: string,
  projectId: string,
  settings: ExportJobInput,
) {
  const project = await getProjectForUser(userId, projectId);

  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const job = await prisma.exportJob.create({
    data: {
      projectId,
      status: "pending",
      resolution: settings.resolution,
      subtitleStyle: settings.subtitleStyle,
      fontSize: settings.fontSize,
      published: settings.published,
    },
  });

  try {
    const exportPackage = buildExportPackage(project, settings);
    const resolutionSlug = settings.resolution.replace(/\s+/g, "-").toLowerCase();
    const videoFileName = `${slugifyFileName(project.title)}-${resolutionSlug}-${job.id}.mp4`;
    const manifestFileName = `${slugifyFileName(project.title)}-${resolutionSlug}-${job.id}.json`;
    const hasRealVideo = Boolean(project.generatedVideoUrl);

    const completedJob = await prisma.$transaction(async (tx) => {
      await tx.mvProject.update({
        where: { id: projectId },
        data: {
          exportResolution: settings.resolution,
          subtitleStyle: settings.subtitleStyle,
          fontSize: settings.fontSize,
          published: settings.published,
        },
      });

      return tx.exportJob.update({
        where: { id: job.id },
        data: {
          status: "completed",
          fileName: hasRealVideo ? videoFileName : manifestFileName,
          outputMimeType: hasRealVideo ? "video/mp4" : "application/json; charset=utf-8",
          outputContent: hasRealVideo
            ? project.generatedVideoUrl
            : JSON.stringify(exportPackage, null, 2),
          completedAt: new Date(),
        },
      });
    });

    return completedJob;
  } catch (error) {
    await prisma.exportJob.update({
      where: { id: job.id },
      data: {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : String(error),
      },
    });

    throw error;
  }
}

export async function getExportJobForUser(userId: string, projectId: string, jobId: string) {
  return prisma.exportJob.findFirst({
    where: {
      id: jobId,
      projectId,
      project: {
        userId,
      },
    },
  });
}

export async function getLatestExportJobForUser(userId: string, projectId: string) {
  return prisma.exportJob.findFirst({
    where: {
      projectId,
      project: {
        userId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function listProjectsForUser(userId: string) {
  const projects = await prisma.mvProject.findMany({
    where: { userId },
    include: {
      musicOptions: true,
      scenes: {
        select: { id: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return projects.map((project) => {
    const selectedMusic =
      project.musicOptions.find((item) => item.id === project.selectedMusicOptionId) ??
      project.musicOptions.find((item) => item.isSelected) ??
      null;

    const resumeUrl =
      project.status === "completed"
        ? `/interfaces/export?projectId=${project.id}`
        : project.generationStatus === "processing" ||
            project.generationStatus === "failed" ||
            project.generationStatus === "cancelled" ||
            project.status === "generating"
          ? `/interfaces/generation?projectId=${project.id}`
          : project.status === "storyboard_ready" || project.scenes.length > 0
            ? `/interfaces/workbench?projectId=${project.id}`
            : project.status === "music_ready" ||
                project.selectedMusicOptionId ||
                project.musicOptions.length > 0
              ? `/interfaces/music?projectId=${project.id}`
              : `/interfaces/create?projectId=${project.id}`;

    const type: "complete" | "generating" | "failed" | "draft" =
      project.status === "completed"
        ? "complete"
        : project.generationStatus === "processing" || project.status === "generating"
          ? "generating"
          : project.generationStatus === "failed" || project.status === "failed"
            ? "failed"
            : "draft";

    return {
      id: project.id,
      title: project.title,
      time: humanizeRelativeTime(project.updatedAt),
      status:
        project.status === "completed"
          ? "已完成"
          : project.status === "generating"
            ? "正在生成..."
            : project.status === "failed"
              ? "生成失败"
              : "草稿",
      tags: selectedMusic ? splitTags(selectedMusic.tags).slice(0, 2) : [project.musicStyle, project.visualStyle],
      likes: formatCompactMetric(project.likeCount),
      plays: formatCompactMetric(project.playCount),
      progress: project.generationProgress || undefined,
      image: project.coverImageUrl ?? selectedMusic?.artworkUrl,
      type,
      resumeUrl,
    };
  });
}

export function formatMusicDuration(durationSec: number) {
  return formatDuration(durationSec);
}

export function formatSceneTimeRange(startSec: number, endSec: number) {
  return `${formatDuration(startSec)} - ${formatDuration(endSec)}`;
}
