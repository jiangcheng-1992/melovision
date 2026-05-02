"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronDown,
  Eye,
  Film,
  GripVertical,
  LoaderCircle,
  Music4,
  Pause,
  Palette,
  Pencil,
  Play,
  PlusCircle,
  RefreshCw,
  Settings,
  Sparkles,
  Trash2,
  Volume2,
  WandSparkles,
  X,
} from "lucide-react";
import { PageNavigationDebug } from "@/components/debug/navigation-debug";
import { AppTopbar } from "@/components/site/app-topbar";
import { HeaderAvatar } from "@/components/site/header-primitives";

type Scene = {
  id: string;
  sortOrder: number;
  startSec: number;
  endSec: number;
  lyricLine: string;
  subtitleText?: string;
  subtitleStartSec?: number;
  subtitleEndSec?: number;
  continuityLine?: string | null;
  prompt: string;
  primaryCharacterId?: string;
  identityLock?: string;
  previewImageUrl?: string | null;
  resultVideoUrl?: string | null;
  generationTaskId?: string | null;
  status: string;
};

type MusicOption = {
  id: string;
  title: string;
  bpm: number;
  genre: string;
  durationSec: number;
};

type WorkbenchStudioProps = {
  project: {
    id: string;
    title: string;
    visualStyle: string;
    scenes: Scene[];
    musicOptions: MusicOption[];
    selectedMusicOptionId?: string | null;
    storyboardSettings?: {
      styleTagsJson: string;
      consistencyBoost: boolean;
      transitionStyle: string;
    } | null;
  };
  projectId: string;
  creditsLabel: string;
};

const steps = [
  { label: "描述", state: "done" as const },
  { label: "音乐", state: "done" as const },
  { label: "分镜", state: "active" as const, number: "3" },
  { label: "生成", state: "todo" as const, number: "4" },
  { label: "导出", state: "todo" as const, number: "5" },
];

const waveform = [
  40, 60, 30, 80, 50, 90, 100, 70, 40, 60, 80, 50, 30, 70, 90, 60, 40, 20, 50,
  80, 100,
];

function isPlaceholderScenePreviewUrl(url?: string | null) {
  if (!url) {
    return true;
  }

  return (
    url.includes("placehold.co") ||
    url.includes("aida-public")
  );
}

function hasPendingScenePreviews(scenes: Scene[]) {
  return scenes.some(
    (scene) => !scene.resultVideoUrl && isPlaceholderScenePreviewUrl(scene.previewImageUrl),
  );
}

function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function getSceneDisplayPreviewUrl(scenes: Scene[], targetScene?: Scene | null) {
  if (!targetScene) {
    return null;
  }

  if (!isPlaceholderScenePreviewUrl(targetScene.previewImageUrl)) {
    return targetScene.previewImageUrl ?? null;
  }

  for (let index = targetScene.sortOrder - 1; index >= 0; index -= 1) {
    const previousScene = scenes.find((scene) => scene.sortOrder === index);
    if (!previousScene) {
      continue;
    }

    if (!isPlaceholderScenePreviewUrl(previousScene.previewImageUrl)) {
      return previousScene.previewImageUrl ?? null;
    }
  }

  return targetScene.previewImageUrl ?? null;
}

function getSceneStatusMeta(status: string) {
  switch (status) {
    case "queued":
      return {
        label: "排队中",
        progress: 15,
        badgeClass: "bg-[#0e0c19] text-[#d2bbff]",
        barClass: "bg-[#7c3aed]",
      };
    case "processing":
      return {
        label: "生成中",
        progress: 65,
        badgeClass: "bg-[#062230] text-[#4cd7f6]",
        barClass: "bg-[#03b5d3]",
      };
    case "completed":
      return {
        label: "视频已生成",
        progress: 100,
        badgeClass: "bg-[#052814] text-[#5af0a5]",
        barClass: "bg-[#10b981]",
      };
    case "failed":
      return {
        label: "生成失败",
        progress: 100,
        badgeClass: "bg-[#3a1014] text-[#ffb4ab]",
        barClass: "bg-[#ff6b6b]",
      };
    default:
      return {
        label: "待生成视频",
        progress: 0,
        badgeClass: "bg-[#0e0c19] text-[#958da1]",
        barClass: "bg-[#4a4455]",
      };
  }
}

function formatSceneTimeRange(startSec: number, endSec: number) {
  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60);
    const seconds = `${value % 60}`.padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return `${formatTime(startSec)} - ${formatTime(endSec)}`;
}

function getSceneSubtitleText(scene?: Scene | null) {
  return scene?.subtitleText?.trim() || scene?.lyricLine?.trim() || "";
}

export function WorkbenchStudio({
  project,
  projectId,
  creditsLabel,
}: WorkbenchStudioProps) {
  const selectedMusic =
    project.musicOptions.find((option) => option.id === project.selectedMusicOptionId) ||
    project.musicOptions[0];
  const [scenes, setScenes] = useState(project.scenes);
  const [selectedSceneId, setSelectedSceneId] = useState(
    project.scenes[1]?.id ?? project.scenes[0]?.id ?? "",
  );
  const [muted, setMuted] = useState(false);
  const [panel, setPanel] = useState<"notifications" | "settings" | null>(null);
  const [styleTags, setStyleTags] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(project.storyboardSettings?.styleTagsJson ?? "[]");
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [project.visualStyle];
    } catch {
      return [project.visualStyle];
    }
  });
  const [consistencyBoost, setConsistencyBoost] = useState(
    project.storyboardSettings?.consistencyBoost ?? true,
  );
  const [transitionStyle, setTransitionStyle] = useState(
    project.storyboardSettings?.transitionStyle ?? "平滑淡入淡出 (Crossfade)",
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [savingSceneId, setSavingSceneId] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [storyboardLoading, setStoryboardLoading] = useState(project.scenes.length === 0);
  const [storyboardLoadError, setStoryboardLoadError] = useState<string | null>(null);
  const soundtrackRef = useRef<HTMLAudioElement | null>(null);

  const selectedScene = useMemo(
    () => scenes.find((scene) => scene.id === selectedSceneId) ?? scenes[0],
    [scenes, selectedSceneId],
  );

  const gridScenes = useMemo(() => {
    if (scenes.length <= 9) {
      return scenes;
    }

    const selectedIndex = scenes.findIndex((scene) => scene.id === selectedSceneId);
    const normalizedIndex = selectedIndex >= 0 ? selectedIndex : 0;
    const start = Math.max(0, Math.min(normalizedIndex - 4, scenes.length - 9));
    return scenes.slice(start, start + 9);
  }, [scenes, selectedSceneId]);

  const selectedSceneStatus = useMemo(
    () => getSceneStatusMeta(selectedScene?.status ?? "ready"),
    [selectedScene?.status],
  );
  const selectedSceneDisplayPreviewUrl = useMemo(
    () => getSceneDisplayPreviewUrl(scenes, selectedScene),
    [scenes, selectedScene],
  );
  const soundtrackUrl = selectedMusic
    ? `/api/projects/${projectId}/music-options/${selectedMusic.id}/audio`
    : null;

  useEffect(() => {
    if (scenes.length > 0) {
      setStoryboardLoading(false);
      setStoryboardLoadError(null);
      return;
    }

    let cancelled = false;
    setStoryboardLoading(true);
    setStoryboardLoadError(null);

    const loadStoryboard = async () => {
      const maxAttempts = 3;

      try {
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
          try {
            const payload = await requestJson<{ scenes: Scene[] }>(`/api/projects/${projectId}/storyboard`);
            if (cancelled) {
              return;
            }

            setScenes(payload.scenes);
            setSelectedSceneId(payload.scenes[0]?.id ?? "");
            setActionMessage(
              payload.scenes.length > 0 ? "分镜已生成，正在为你加载工作台。" : "当前项目暂未生成分镜。",
            );
            return;
          } catch (error) {
            if (cancelled) {
              return;
            }

            if (attempt === maxAttempts) {
              throw error;
            }

            await wait(attempt * 1200);
          }
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        const message = error instanceof Error ? error.message : "分镜加载失败";
        setStoryboardLoadError(message);
        setActionMessage(`分镜加载失败：${message}`);
      } finally {
        if (!cancelled) {
          setStoryboardLoading(false);
        }
      }
    };

    void loadStoryboard();

    return () => {
      cancelled = true;
    };
  }, [projectId, scenes.length]);

  useEffect(() => {
    if (!scenes.some((scene) => scene.status === "queued" || scene.status === "processing")) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const payload = await requestJson<{ scenes: Scene[] }>(`/api/projects/${projectId}/storyboard`);
        setScenes(payload.scenes);
      } catch {
        // Ignore polling failures and keep the current UI state.
      }
    }, 4000);

    return () => window.clearInterval(timer);
  }, [projectId, scenes]);

  useEffect(() => {
    if (storyboardLoading || scenes.length === 0 || !hasPendingScenePreviews(scenes)) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const payload = await requestJson<{ scenes: Scene[] }>(`/api/projects/${projectId}/storyboard`);
        setScenes(payload.scenes);
      } catch {
        // Ignore polling failures and keep the current UI state.
      }
    }, 8000);

    return () => window.clearInterval(timer);
  }, [projectId, scenes, storyboardLoading]);

  useEffect(() => {
    setVideoPlaying(false);
    setVideoReady(false);
    setVideoError(null);
    setVideoCurrentTime(0);
    setVideoDuration(0);
  }, [selectedScene?.id, selectedScene?.resultVideoUrl]);

  useEffect(() => {
    const audio = soundtrackUrl ? new Audio(soundtrackUrl) : null;
    if (audio) {
      audio.preload = "auto";
      audio.muted = muted;
      soundtrackRef.current = audio;
    } else {
      soundtrackRef.current = null;
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      soundtrackRef.current = null;
    };
  }, [soundtrackUrl]);

  useEffect(() => {
    if (soundtrackRef.current) {
      soundtrackRef.current.muted = muted;
    }
  }, [muted]);

  function showAction(message: string) {
    setActionMessage(message);
  }

  async function requestJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    const response = await fetch(input, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "REQUEST_FAILED");
    }

    return payload as T;
  }

  function updateScenePrompt(sceneId: string, prompt: string) {
    setScenes((current) =>
      current.map((scene) => (scene.id === sceneId ? { ...scene, prompt } : scene)),
    );
  }

  async function saveScenePrompt(sceneId: string) {
    const scene = scenes.find((item) => item.id === sceneId);
    if (!scene) {
      return;
    }

    try {
      setSavingSceneId(sceneId);
      const payload = await requestJson<{ scene: Scene }>(
        `/api/projects/${projectId}/storyboard/scenes/${sceneId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            prompt: scene.prompt,
            lyricLine: scene.lyricLine,
          }),
        },
      );

      setScenes((current) =>
        current.map((item) => (item.id === sceneId ? { ...item, ...payload.scene } : item)),
      );
      showAction("当前场景已保存到工作台");
    } catch (error) {
      showAction(error instanceof Error ? error.message : "场景保存失败");
    } finally {
      setSavingSceneId(null);
    }
  }

  async function refreshScene(sceneId: string) {
    try {
      const payload = await requestJson<{ scene: Scene }>(
        `/api/projects/${projectId}/storyboard/scenes/${sceneId}/regenerate`,
        { method: "POST", body: JSON.stringify({}) },
      );

      setScenes((current) =>
        current.map((scene) => (scene.id === sceneId ? { ...scene, ...payload.scene } : scene)),
      );
      showAction("已重新生成当前场景的提示词草稿");
    } catch (error) {
      showAction(error instanceof Error ? error.message : "场景重生成失败");
    }
  }

  async function deleteScene(sceneId: string) {
    if (scenes.length <= 1) {
      showAction("至少需要保留 1 个场景");
      return;
    }

    try {
      await requestJson<{ ok: true }>(
        `/api/projects/${projectId}/storyboard/scenes/${sceneId}`,
        { method: "DELETE", body: JSON.stringify({}) },
      );

      setScenes((current) => {
        const nextScenes = current.filter((scene) => scene.id !== sceneId);
        if (selectedSceneId === sceneId) {
          setSelectedSceneId(nextScenes[0]?.id ?? "");
        }
        return nextScenes;
      });
      showAction("已移除该场景");
    } catch (error) {
      showAction(error instanceof Error ? error.message : "场景删除失败");
    }
  }

  async function addScene() {
    try {
      const payload = await requestJson<{ scene: Scene }>(
        `/api/projects/${projectId}/storyboard`,
        { method: "POST", body: JSON.stringify({}) },
      );

      setScenes((current) => [...current, payload.scene]);
      setSelectedSceneId(payload.scene.id);
      showAction("已新增一个场景草稿并保存到后端");
    } catch (error) {
      showAction(error instanceof Error ? error.message : "新增场景失败");
    }
  }

  async function optimizeSelectedScene() {
    if (!selectedScene) {
      return;
    }

    try {
      const payload = await requestJson<{ scene: Scene }>(
        `/api/projects/${projectId}/storyboard/scenes/${selectedScene.id}/optimize`,
        { method: "POST", body: JSON.stringify({}) },
      );

      setScenes((current) =>
        current.map((scene) =>
          scene.id === selectedScene.id ? { ...scene, ...payload.scene } : scene,
        ),
      );
      showAction("已用 AI 优化当前场景提示词");
    } catch (error) {
      showAction(error instanceof Error ? error.message : "场景优化失败");
    }
  }

  async function generateSceneVideo(sceneId: string) {
    try {
      setGeneratingSceneId(sceneId);
      const payload = await requestJson<{ scene: Scene }>(
        `/api/projects/${projectId}/storyboard/scenes/${sceneId}/video`,
        { method: "POST", body: JSON.stringify({}) },
      );

      setScenes((current) =>
        current.map((scene) => (scene.id === sceneId ? { ...scene, ...payload.scene } : scene)),
      );
      showAction("已提交当前分镜视频生成任务");
    } catch (error) {
      showAction(error instanceof Error ? error.message : "分镜视频生成失败");
    } finally {
      setGeneratingSceneId(null);
    }
  }

  function formatVideoTime(value: number) {
    const safe = Math.max(0, Math.floor(value));
    const minutes = Math.floor(safe / 60);
    const seconds = `${safe % 60}`.padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function togglePreviewPlayback() {
    const video = document.getElementById("workbench-scene-preview-video") as HTMLVideoElement | null;
    const soundtrack = soundtrackRef.current;

    if (!selectedScene) {
      return;
    }

    if (video && !video.paused) {
      video.pause();
      soundtrack?.pause();
      setVideoPlaying(false);
      return;
    }

    if (!video && soundtrack) {
      soundtrack.currentTime = selectedScene.startSec;
      void soundtrack.play();
      setVideoPlaying(true);
      return;
    }

    if (video) {
      const soundtrackOffset = selectedScene.startSec + video.currentTime;
      if (soundtrack) {
        soundtrack.currentTime = soundtrackOffset;
        void soundtrack.play();
      }
      void video.play();
      setVideoPlaying(true);
    }
  }

  async function saveStoryboardSettings(next: {
    styleTags: string[];
    consistencyBoost: boolean;
    transitionStyle: string;
  }) {
    try {
      setSavingSettings(true);
      await requestJson<{ settings: unknown }>(
        `/api/projects/${projectId}/storyboard/settings`,
        {
          method: "PATCH",
          body: JSON.stringify(next),
        },
      );
      showAction("工作台设置已保存");
    } catch (error) {
      showAction(error instanceof Error ? error.message : "工作台设置保存失败");
    } finally {
      setSavingSettings(false);
    }
  }

  async function removeTag(tag: string) {
    const nextTags = styleTags.filter((item) => item !== tag);
    setStyleTags(nextTags);
    await saveStoryboardSettings({
      styleTags: nextTags,
      consistencyBoost,
      transitionStyle,
    });
    showAction(`已移除风格标签：${tag}`);
  }

  async function addTag() {
    const nextTag = window.prompt("请输入新的风格标签");
    if (!nextTag?.trim()) {
      return;
    }

    const normalized = nextTag.trim();
    const nextTags = styleTags.includes(normalized) ? styleTags : [...styleTags, normalized];
    setStyleTags(nextTags);
    await saveStoryboardSettings({
      styleTags: nextTags,
      consistencyBoost,
      transitionStyle,
    });
    showAction(`已添加风格标签：${nextTag.trim()}`);
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#14121f] text-[#e5e0f3]">
      <PageNavigationDebug pageName="workbench" />
      <AppTopbar
        sourcePage="workbench"
        creditsLabel={creditsLabel}
        navItems={[
          {
            href: "/interfaces/workbench",
            label: "工作台",
            active: true,
            debugLabel: "workbench-nav-workbench",
            sourcePage: "workbench",
          },
          {
            href: "/interfaces/projects",
            label: "项目",
            debugLabel: "workbench-nav-projects",
            sourcePage: "workbench",
          },
        ]}
        rightSlot={
          <div className="relative hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() =>
                setPanel((current) => (current === "notifications" ? null : "notifications"))
              }
              className="text-[#a9a2ba] transition-colors hover:text-[#f5f3ff]"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setPanel((current) => (current === "settings" ? null : "settings"))}
              className="text-[#a9a2ba] transition-colors hover:text-[#f5f3ff]"
            >
              <Settings className="h-5 w-5" />
            </button>
            <HeaderAvatar />

            {panel ? (
              <div className="absolute top-12 right-0 z-20 w-72 rounded-2xl border border-[#4a4455]/20 bg-[#1c1a27]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#e5e0f3]">
                    {panel === "notifications" ? "工作台通知" : "工作台设置"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setPanel(null)}
                    className="text-[#958da1] transition-colors hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-[#ccc3d8]">
                  {panel === "notifications"
                    ? "新的分镜草稿、AI 优化结果和渲染进度提醒会显示在这里。"
                    : "这里后续会接入真实的分镜保存、批量操作和画面一致性策略。"}
                </p>
              </div>
            ) : null}
          </div>
        }
      />

      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden pt-16">
        <header className="relative z-10 shrink-0 border-b border-[#4a4455]/10 bg-[#0e0c19]/60 px-4 py-6 md:px-6 md:py-7 xl:px-8 xl:py-8">
          <div className="absolute top-1/2 left-4 hidden -translate-y-1/2 items-center gap-2 md:flex md:left-6 xl:left-8">
            <span className="text-sm text-[#e5e0f3]/80">创作工作台</span>
            <span className="text-sm text-[#4a4455]">/ {project.title}</span>
          </div>

          <div className="relative mx-auto flex max-w-4xl justify-between px-2 md:px-10 xl:px-12">
            <div className="absolute top-6 left-[12%] right-[12%] hidden h-px bg-[#4a4455]/20 md:block" />
            <div className="absolute top-6 left-[12%] hidden h-px w-[42%] bg-[#d2bbff]/60 md:block" />

            {steps.map((step) => (
              <div key={step.label} className="flex flex-col items-center gap-3">
                {step.state === "done" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7c3aed] text-white">
                    <Check className="h-5 w-5" />
                  </div>
                ) : null}

                {step.state === "active" ? (
                  <div className="relative -mt-1 flex h-14 w-14 items-center justify-center rounded-full bg-[#7c3aed] text-xl font-bold text-white shadow-[0_0_30px_rgba(124,58,237,0.7)] ring-4 ring-[#7c3aed]/20">
                    {step.number}
                  </div>
                ) : null}

                {step.state === "todo" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#4a4455]/30 bg-[#1c1a27] text-lg text-[#ccc3d8]">
                    {step.number}
                  </div>
                ) : null}

                <span
                  className={`text-xs md:text-sm ${
                    step.state === "active"
                      ? "font-bold text-[#e5e0f3]"
                      : step.state === "todo"
                        ? "text-[#958da1]"
                        : "text-[#ccc3d8]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </header>

        {actionMessage ? (
          <div className="border-b border-[#4cd7f6]/10 bg-[#062230] px-8 py-3 text-sm text-[#b6eeff]">
            {actionMessage}
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row">
          <section className="min-h-0 w-full overflow-y-auto px-4 py-6 pb-44 md:px-6 md:py-8 md:pb-36 xl:w-[58%] xl:px-8">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="flex items-center gap-3 text-2xl font-bold">
                <Film className="h-6 w-6 text-[#7c3aed]" />
                您的 MV 分镜
              </h1>
              <span className="rounded-full border border-[#4a4455]/20 bg-[#2b2836] px-3 py-1 text-xs font-medium text-[#ccc3d8]">
                {storyboardLoading ? "正在生成分镜" : scenes.length > 0 ? "自动生成完成" : "等待生成分镜"}
              </span>
            </div>

            <div className="flex flex-col gap-6">
              {storyboardLoading ? (
                <div className="rounded-2xl border border-[#4cd7f6]/20 bg-[#062230]/40 p-5 text-sm text-[#b6eeff]">
                  正在根据歌词、角色锚点和连续性规则生成分镜，请稍候...
                </div>
              ) : null}

              {!storyboardLoading && storyboardLoadError ? (
                <div className="rounded-2xl border border-[#ffb4ab]/20 bg-[#93000a]/10 p-5 text-sm text-[#ffd7d1]">
                  分镜加载失败：{storyboardLoadError}
                </div>
              ) : null}

              {!storyboardLoading && scenes.length === 0 ? (
                <div className="rounded-2xl border border-[#4a4455]/20 bg-[#201e2c] p-6 text-sm text-[#ccc3d8]">
                  当前还没有可用分镜，你可以稍后刷新重试，或点击下方按钮手动新增一个场景。
                </div>
              ) : null}

              {scenes.map((scene, index) => {
                const isActive = scene.id === selectedScene?.id;
                const sceneStatus = getSceneStatusMeta(scene.status);

                return (
                  <div
                    key={scene.id}
                    className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
                      isActive
                        ? "bg-[#2b2836] ring-1 ring-[#d2bbff]/40 shadow-[0_0_30px_rgba(124,58,237,0.1)]"
                        : "bg-[#201e2c] hover:-translate-y-1 hover:bg-[#2b2836]"
                    }`}
                  >
                    {isActive ? (
                      <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#7c3aed] to-[#03b5d3]" />
                    ) : null}
                    <div className="flex gap-4">
                      <div
                        className={`cursor-grab pt-2 transition-opacity ${
                          isActive
                            ? "text-[#7c3aed]"
                            : "text-[#958da1] opacity-50 group-hover:opacity-100"
                        }`}
                      >
                        <GripVertical className="h-5 w-5" />
                      </div>

                      <div className="flex-1">
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-lg font-bold ${
                                isActive ? "text-[#d2bbff]" : "text-[#4cd7f6]"
                              }`}
                            >
                              #{index + 1}
                            </span>
                            <span
                              className={`rounded px-2 py-1 text-xs ${
                                isActive
                                  ? "border border-[#d2bbff]/20 bg-[#0e0c19] text-[#d2bbff]"
                                  : "bg-[#0e0c19] text-[#ccc3d8]"
                              }`}
                            >
                              {formatSceneTimeRange(scene.startSec, scene.endSec)}
                            </span>
                            {isActive ? (
                              <span className="flex items-center gap-1 rounded-full bg-[#4cd7f6]/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#4cd7f6]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#4cd7f6]" />
                                当前编辑
                              </span>
                            ) : null}
                            <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${sceneStatus.badgeClass}`}>
                              {sceneStatus.label}
                            </span>
                          </div>

                          <div
                            className={`flex gap-2 transition-opacity ${
                              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => refreshScene(scene.id)}
                              className="rounded-lg bg-[#0e0c19] p-1.5 text-[#ccc3d8] transition-colors hover:text-[#4cd7f6]"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteScene(scene.id)}
                              className="rounded-lg bg-[#0e0c19] p-1.5 text-[#ccc3d8] transition-colors hover:text-[#ffb4ab]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div
                          className={`mb-4 pl-4 text-sm italic ${
                            isActive
                              ? "border-l-2 border-[#d2bbff]/50 text-[#e5e0f3]"
                              : "border-l-2 border-[#4a4455]/30 text-[#ccc3d8]/80"
                          }`}
                        >
                          "{scene.lyricLine}"
                        </div>

                        {scene.primaryCharacterId ? (
                          <div className="mb-3 flex flex-wrap gap-2 text-[11px] text-[#9ad7ff]">
                            <span className="rounded-full border border-[#214258] bg-[#0c1a25] px-2 py-1">
                              主角锁定：{scene.primaryCharacterId}
                            </span>
                          </div>
                        ) : null}

                        {scene.continuityLine ? (
                          <div className="mb-4 rounded-lg border border-[#4a4455]/20 bg-[#14121f] px-3 py-2 text-xs text-[#958da1]">
                            连续性提示：{scene.continuityLine}
                          </div>
                        ) : null}

                        {scene.identityLock ? (
                          <div className="mb-4 rounded-lg border border-[#1c3345] bg-[#0d1822] px-3 py-2 text-xs text-[#9ad7ff]">
                            角色一致性：{scene.identityLock}
                          </div>
                        ) : null}

                        <div className="mb-4 rounded-lg border border-[#4a4455]/20 bg-[#14121f] px-3 py-3">
                          <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wider text-[#958da1]">
                            <span>本段视频进度</span>
                            <span>{sceneStatus.progress}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#0e0c19]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${sceneStatus.barClass}`}
                              style={{ width: `${sceneStatus.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <textarea
                            value={scene.prompt}
                            onChange={(event) => updateScenePrompt(scene.id, event.target.value)}
                            onBlur={() => void saveScenePrompt(scene.id)}
                            readOnly={!isActive}
                            className={`w-full rounded-xl p-4 text-sm leading-relaxed text-[#e5e0f3] ${
                              isActive
                                ? "h-32 border border-[#d2bbff]/30 bg-[#0e0c19] shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:ring-1 focus:ring-[#d2bbff]"
                                : "h-24 resize-none border-0 bg-[#0e0c19]"
                            }`}
                          />

                          {isActive ? (
                            <div className="absolute right-3 bottom-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={optimizeSelectedScene}
                                className="flex items-center gap-1 rounded-lg bg-[#7c3aed] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#8b4eff]"
                              >
                                <WandSparkles className="h-[14px] w-[14px]" />
                                {savingSceneId === scene.id ? "保存中..." : "AI 优化"}
                              </button>
                              <button
                                type="button"
                                onClick={() => generateSceneVideo(scene.id)}
                                disabled={scene.status === "queued" || scene.status === "processing"}
                                className="flex items-center gap-1 rounded-lg bg-[#03b5d3] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#14c6e3] disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {scene.status === "queued" || scene.status === "processing" ? (
                                  <LoaderCircle className="h-[14px] w-[14px] animate-spin" />
                                ) : (
                                  <Play className="h-[14px] w-[14px] fill-current" />
                                )}
                                {generatingSceneId === scene.id
                                  ? "提交中..."
                                  : scene.status === "completed"
                                    ? "重新生成视频"
                                    : scene.status === "queued" || scene.status === "processing"
                                      ? "生成中..."
                                    : "生成本段视频"}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedSceneId(scene.id);
                                showAction(`已切换到场景 #${index + 1}`);
                              }}
                              className="absolute top-2 right-2 rounded-lg bg-[#0e0c19] p-2 text-[#958da1] transition-colors hover:text-[#d2bbff]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={addScene}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#4a4455]/30 bg-[#0e0c19]/50 py-4 font-medium text-[#958da1] transition-colors hover:border-[#d2bbff]/50 hover:text-[#d2bbff]"
              >
                <PlusCircle className="h-5 w-5" />
                添加新场景
              </button>
            </div>
          </section>

          <aside className="relative flex min-h-0 w-full flex-col border-t border-[#4a4455]/20 bg-[#1c1a27] xl:w-[42%] xl:border-t-0 xl:border-l">
            <div className="flex h-full flex-col gap-4 overflow-y-auto p-4 pb-44 md:gap-6 md:p-6 md:pb-36">
              <div className="flex flex-col gap-3">
                <h2 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#ccc3d8]">
                  <Eye className="h-4 w-4" />
                  九宫格分镜预览
                </h2>

                <div className="group relative aspect-video overflow-hidden rounded-xl border border-[#4a4455]/20 bg-[#0e0c19] shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                  {selectedScene?.resultVideoUrl ? (
                    <video
                      id="workbench-scene-preview-video"
                      className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                      src={selectedScene.resultVideoUrl}
                      muted={Boolean(soundtrackUrl) || muted}
                      onCanPlay={() => setVideoReady(true)}
                      onPlay={() => setVideoPlaying(true)}
                      onPause={() => setVideoPlaying(false)}
                      onEnded={() => setVideoPlaying(false)}
                      onTimeUpdate={(event) =>
                        setVideoCurrentTime((event.currentTarget as HTMLVideoElement).currentTime)
                      }
                      onLoadedMetadata={(event) =>
                        setVideoDuration((event.currentTarget as HTMLVideoElement).duration || 0)
                      }
                      onError={() => setVideoError("当前分镜视频预览加载失败")}
                      playsInline
                    />
                  ) : (
                    <img
                      alt="Concept art preview"
                      className="h-full w-full object-cover opacity-80 mix-blend-lighten transition-transform duration-700 group-hover:scale-105"
                      src={
                        selectedSceneDisplayPreviewUrl ||
                        scenes[0]?.previewImageUrl ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuC-IFJF1uA2sILcaHTWcap0b1Zcpwk5NC4kecxksehUJOIY2mTm4AfMyjxhwXj7fUBE2JANz2ZO3xak7gWJfsML9IZK6_b39fpF4QAzQUGCpOzYyXjmr_dmYCCpZuIaaaOjfCv1saQVnQ7iKGTtXSXPzkw8Gwd4OvuYprztZdofzggUDOR2Tt3ycbx28Kv0iTkzrsFYd4nhjPrjZj_NV96lkhrGD45VraA534_5_lcJ7cHZAu4cde-Lmp915cRD5zzefnGrDL-Sqw"
                      }
                    />
                  )}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#14121f]/90 via-[#14121f]/20 to-transparent p-4">
                    {getSceneSubtitleText(selectedScene) ? (
                      <div className="mb-3 flex justify-center">
                        <div className="max-w-[85%] rounded-lg bg-black/55 px-3 py-2 text-center text-sm font-medium text-white shadow-[0_6px_18px_rgba(0,0,0,0.35)] backdrop-blur-sm">
                          {getSceneSubtitleText(selectedScene)}
                        </div>
                      </div>
                    ) : null}
                    <div className="flex items-end justify-between">
                      <span className="rounded bg-[#363342]/80 px-2 py-1 font-mono text-xs text-[#4cd7f6] backdrop-blur-md">
                        {selectedScene?.status === "completed" ? "视频封面图" : selectedSceneStatus.label} / {formatSceneTimeRange(selectedScene?.startSec ?? 0, selectedScene?.endSec ?? 0)}
                      </span>
                      <button
                        type="button"
                        onClick={
                          selectedScene?.resultVideoUrl
                            ? togglePreviewPlayback
                            : () => selectedScene && generateSceneVideo(selectedScene.id)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7c3aed] text-white shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-transform hover:scale-110"
                      >
                        {selectedScene?.resultVideoUrl ? (
                          videoPlaying ? (
                            <Pause className="h-4 w-4 fill-current" />
                          ) : (
                            <Play className="ml-0.5 h-4 w-4 fill-current" />
                          )
                        ) : selectedScene?.status === "queued" || selectedScene?.status === "processing" ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="ml-0.5 h-4 w-4 fill-current" />
                        )}
                      </button>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#0e0c19]/80">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${selectedSceneStatus.barClass}`}
                          style={{
                            width: `${
                              selectedScene?.resultVideoUrl && videoDuration > 0
                                ? (videoCurrentTime / videoDuration) * 100
                                : selectedSceneStatus.progress
                            }%`,
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#ccc3d8]">
                        <span>
                          {selectedScene?.resultVideoUrl
                            ? `${formatVideoTime(videoCurrentTime)} / ${formatVideoTime(videoDuration)}`
                            : selectedSceneStatus.label}
                        </span>
                        <span>
                          {selectedScene?.resultVideoUrl
                            ? videoReady
                              ? "可播放"
                              : "加载中"
                            : "等待生成"}
                        </span>
                      </div>
                      {videoError ? (
                        <div className="text-[11px] text-[#ffb4ab]">{videoError}</div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {gridScenes.map((scene) => {
                    const isSelected = scene.id === selectedScene?.id;
                    const displayPreviewUrl = getSceneDisplayPreviewUrl(scenes, scene);
                    const showGeneratedVideoPreview =
                      Boolean(scene.resultVideoUrl) && isPlaceholderScenePreviewUrl(scene.previewImageUrl);
                    return (
                      <button
                        key={scene.id}
                        type="button"
                        onClick={() => setSelectedSceneId(scene.id)}
                        className={`relative aspect-square overflow-hidden rounded-xl border text-left transition ${
                          isSelected
                            ? "border-[#d2bbff] shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                            : "border-[#4a4455]/20 hover:border-[#4cd7f6]/40"
                        }`}
                      >
                        {showGeneratedVideoPreview ? (
                          <video
                            className="h-full w-full object-cover"
                            src={scene.resultVideoUrl ?? undefined}
                            muted
                            playsInline
                            preload="metadata"
                          />
                        ) : (
                          <img
                            alt={`Scene ${scene.sortOrder + 1}`}
                            className="h-full w-full object-cover"
                            src={displayPreviewUrl || "https://placehold.co/512x512/14121f/7c3aed?text=Scene"}
                          />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#14121f] to-transparent p-2">
                          {getSceneSubtitleText(scene) ? (
                            <div className="mb-1 line-clamp-2 rounded bg-black/45 px-1.5 py-1 text-[10px] text-white">
                              {getSceneSubtitleText(scene)}
                            </div>
                          ) : null}
                          <div className="text-[10px] font-bold text-white">#{scene.sortOrder + 1}</div>
                          <div className="text-[10px] text-[#ccc3d8]">
                            {formatSceneTimeRange(scene.startSec, scene.endSec)}
                          </div>
                        </div>
                        {scene.status === "completed" ? (
                          <div className="absolute top-2 right-2 rounded-full bg-[#03b5d3] px-2 py-0.5 text-[10px] font-medium text-white">
                            {showGeneratedVideoPreview ? "视频预览" : "封面"}
                          </div>
                        ) : scene.status === "queued" || scene.status === "processing" ? (
                          <div className="absolute top-2 right-2 rounded-full bg-[#7c3aed] px-2 py-0.5 text-[10px] font-medium text-white">
                            生成中
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-[#4a4455]/10 bg-[#201e2c] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0e0c19] text-[#4cd7f6]">
                      <Music4 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="w-48 truncate text-sm font-medium text-[#e5e0f3]">
                        {selectedMusic?.title}
                      </p>
                      <p className="text-xs text-[#ccc3d8]">BPM: {selectedMusic?.bpm} · {selectedMusic?.genre}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMuted((current) => !current)}
                    className="text-[#958da1] transition-colors hover:text-[#e5e0f3]"
                  >
                    <Volume2 className={`h-5 w-5 ${muted ? "opacity-40" : ""}`} />
                  </button>
                </div>

                <div className="relative mt-2 flex h-8 items-end gap-[2px]">
                  <div className="absolute left-0 flex h-full w-[15%] items-end gap-[2px] overflow-hidden">
                    {waveform.slice(0, 9).map((height, index) => (
                      <div
                        key={`active-${index}`}
                        className={`w-1 rounded-t-sm ${muted ? "bg-[#4a4455]" : "bg-[#4cd7f6]"}`}
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex h-full w-full items-end gap-[2px]">
                    {waveform.map((height, index) => (
                      <div
                        key={`full-${index}`}
                        className="w-1 rounded-t-sm bg-[#4a4455]/50"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                  <div className="absolute top-0 bottom-0 left-[15%] w-px bg-[#d2bbff] shadow-[0_0_10px_rgba(210,187,255,1)]" />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 border-b border-[#4a4455]/20 pb-2 text-sm font-medium uppercase tracking-widest text-[#ccc3d8]">
                  <Palette className="h-4 w-4" />
                  全局视觉风格
                </h2>

                <div>
                  <span className="mb-2 block text-xs text-[#ccc3d8]">当前主风格</span>
                  <div className="flex flex-wrap gap-2">
                    {styleTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-1 rounded-full border border-[#d2bbff]/40 bg-[#2b2836] px-3 py-1.5 text-sm text-[#d2bbff] shadow-[0_0_10px_rgba(124,58,237,0.1)]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-[#ccc3d8] transition-colors hover:text-white"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addTag}
                      className="rounded-full border border-[#4a4455]/30 bg-[#0e0c19] px-3 py-1.5 text-sm text-[#ccc3d8] transition-colors hover:bg-[#363342]"
                    >
                      + 添加标签
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-xl bg-[#201e2c] p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#e5e0f3]">角色一致性</p>
                      <p className="text-xs text-[#ccc3d8]">保持跨场景的人物特征</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        checked={consistencyBoost}
                        onChange={(event) => {
                          const nextValue = event.target.checked;
                          setConsistencyBoost(nextValue);
                          void saveStoryboardSettings({
                            styleTags,
                            consistencyBoost: nextValue,
                            transitionStyle,
                          });
                        }}
                        className="peer sr-only"
                        type="checkbox"
                      />
                      <div className="h-6 w-11 rounded-full bg-[#363342] after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#7c3aed] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                    </label>
                  </div>

                  <hr className="border-[#4a4455]/10" />

                  <div>
                    <label className="mb-2 block text-xs text-[#ccc3d8]">
                      默认过渡风格
                    </label>
                    <div className="relative">
                      <select
                        value={transitionStyle}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setTransitionStyle(nextValue);
                          void saveStoryboardSettings({
                            styleTags,
                            consistencyBoost,
                            transitionStyle: nextValue,
                          });
                        }}
                        className="w-full appearance-none rounded-lg border border-[#4a4455]/30 bg-[#0e0c19] py-2 pl-3 pr-10 text-sm text-[#e5e0f3] focus:border-[#d2bbff] focus:ring-1 focus:ring-[#d2bbff]"
                      >
                        <option>平滑淡入淡出 (Crossfade)</option>
                        <option>硬切 (Hard Cut)</option>
                        <option>动感缩放 (Dynamic Zoom)</option>
                        <option>光效闪白 (Flash)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#958da1]">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
                {savingSettings ? (
                  <div className="rounded-lg border border-[#4cd7f6]/20 bg-[#062230] px-3 py-2 text-xs text-[#b6eeff]">
                    正在保存工作台设置...
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed right-0 bottom-0 left-0 z-40 flex flex-col gap-3 border-t border-[#4a4455]/10 bg-[#14121f]/85 px-4 py-3 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:flex-row md:items-center md:justify-between md:gap-4 md:px-6 md:py-4 xl:px-8">
        <Link
          href={`/interfaces/music?projectId=${projectId}`}
          className="flex items-center gap-2 text-sm font-medium text-[#ccc3d8] transition-colors hover:text-[#d2bbff] md:text-base"
        >
          <ArrowLeft className="h-4 w-4" />
          返回音乐设定
        </Link>

        <div className="rounded-full border border-[#4a4455]/10 bg-[#1c1a27] px-4 py-1.5 text-xs text-[#ccc3d8] md:text-sm">
          共 <span className="font-bold text-[#e5e0f3]">{scenes.length}</span> 个场景 · 预计视频时长{" "}
          <span className="font-mono text-[#4cd7f6]">
            {Math.floor((selectedMusic?.durationSec || 192) / 60)}:{((selectedMusic?.durationSec || 192) % 60).toString().padStart(2, "0")}
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-3 md:w-auto md:justify-end md:gap-4">
          <span className="flex items-center gap-1 text-xs text-[#958da1]">
            <Sparkles className="h-[14px] w-[14px]" />
            消耗 20 积分
          </span>
          <Link
            href={`/interfaces/generation?projectId=${projectId}`}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-5 py-3 text-sm font-bold tracking-wide text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(76,215,246,0.6)] md:px-8 md:text-base"
          >
            <Sparkles className="h-4 w-4 transition-transform group-hover:rotate-12" />
            进入整片生成
          </Link>
        </div>
      </div>
    </div>
  );
}
