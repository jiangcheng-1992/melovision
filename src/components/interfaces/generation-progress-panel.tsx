"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle, Sparkles } from "lucide-react";
import { AppTopbar } from "@/components/site/app-topbar";

type GenerationSnapshot = {
  project: {
    id: string;
    title: string;
    status: string;
    generationStatus: string;
    generationProgress: number;
    coverImageUrl?: string | null;
    exportReady: boolean;
  };
  job: {
    id: string;
    status: string;
    progress: number;
    totalScenes: number;
    completedScenes: number;
    startedAt: string;
    completedAt: string | null;
    cancelledAt: string | null;
    errorMessage?: string | null;
    currentSceneNumber: number | null;
    estimatedRemainingMs: number;
  };
  scenes: Array<{
    id: string;
    sortOrder: number;
    startSec: number;
    endSec: number;
    previewImageUrl?: string | null;
    status: string;
  }>;
  logs: Array<{
    id: string;
    level: string;
    message: string;
    createdAt: string;
  }>;
};

const steps = [
  { label: "描述", state: "done" as const },
  { label: "音乐", state: "done" as const },
  { label: "分镜", state: "done" as const },
  { label: "生成", state: "active" as const, number: "4" },
  { label: "导出", state: "todo" as const, number: "5" },
];

function formatRemainingMs(remainingMs: number) {
  if (remainingMs <= 0) {
    return "即将完成";
  }

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes <= 0) {
    return `~${seconds}秒`;
  }

  return `~${minutes}分${seconds.toString().padStart(2, "0")}秒`;
}

function StepCircle({
  label,
  state,
  number,
}: {
  label: string;
  state: "done" | "active" | "todo";
  number?: string;
}) {
  if (state === "done") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4CD7F6] text-black shadow-[0_0_15px_rgba(76,215,246,0.4)]">
          <Check className="h-5 w-5" />
        </div>
        <span className="text-sm font-medium text-[#ccc3d8]">{label}</span>
      </div>
    );
  }

  if (state === "active") {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] ring-4 ring-[#7C3AED]/20">
          <span className="font-display text-lg font-bold">{number}</span>
        </div>
        <span className="text-sm font-bold text-[#d2bbff]">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#363342] text-[#958da1]">
        <span className="font-display text-lg font-bold">{number}</span>
      </div>
      <span className="text-sm font-medium text-[#958da1]">{label}</span>
    </div>
  );
}

function SceneCard({
  image,
  index,
  isActive,
}: {
  image?: string | null;
  index: number;
  isActive?: boolean;
}) {
  if (isActive) {
    return (
      <div className="relative flex aspect-square animate-pulse items-center justify-center rounded-xl border-2 border-[#7C3AED] bg-[#2b2836] shadow-[0_0_15px_5px_rgba(124,58,237,0.2)]">
        <div className="flex flex-col items-center gap-2">
          <LoaderCircle className="h-8 w-8 animate-spin text-[#d2bbff]" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#d2bbff]">
            Gen S{index + 1}
          </span>
        </div>
      </div>
    );
  }

  if (image) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl border border-[#4CD7F6]/30">
        <img
          alt={`Scene ${index + 1}`}
          className="h-full w-full object-cover grayscale-[0.5]"
          src={image}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-[#4CD7F6]/20">
          <Check className="h-6 w-6 text-[#4CD7F6]" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-white/5 bg-[#0e0c19]">
      <div className="absolute inset-0 flex items-center justify-center text-[#958da1]/30">
        <LoaderCircle className="h-6 w-6" />
      </div>
    </div>
  );
}

export function GenerationProgressPanel({
  initialSnapshot,
  projectId,
  creditsLabel,
}: {
  initialSnapshot: GenerationSnapshot;
  projectId: string;
  creditsLabel: string;
}) {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    if (snapshot.job.status !== "processing" && snapshot.job.status !== "pending") {
      return;
    }

    const poll = async () => {
      try {
        const response = await fetch(
          `/api/projects/${projectId}/generation-jobs/${snapshot.job.id}`,
          {
            cache: "no-store",
          },
        );
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "GENERATION_JOB_FETCH_FAILED");
        }

        if (payload.snapshot) {
          setSnapshot(payload.snapshot as GenerationSnapshot);
          setActionError(null);
        }
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "生成状态刷新失败");
      }
    };

    const timer = window.setInterval(poll, 3000);
    return () => window.clearInterval(timer);
  }, [projectId, snapshot.job.id, snapshot.job.status]);

  const progress = snapshot.job.progress || 0;
  const totalScenes = snapshot.job.totalScenes || snapshot.scenes.length || 1;
  const completedScenes = Math.min(snapshot.job.completedScenes, totalScenes);
  const activeSceneIndex =
    snapshot.job.status === "processing" && completedScenes < totalScenes
      ? completedScenes
      : -1;

  const statusLabel = useMemo(() => {
    if (snapshot.job.status === "completed") {
      return "生成完成";
    }

    if (snapshot.job.status === "cancelled") {
      return "已取消";
    }

    if (snapshot.job.status === "failed") {
      return "生成失败";
    }

    return "正在生成...";
  }, [snapshot.job.status]);

  const etaText = useMemo(() => {
    if (snapshot.job.status === "completed") {
      return "已完成所有分镜合成";
    }

    if (snapshot.job.status === "cancelled") {
      return "任务已取消，可返回工作台调整后重新开始";
    }

    if (snapshot.job.status === "failed") {
      return snapshot.job.errorMessage || "任务失败，请重新发起生成";
    }

    return `预计剩余时间：${formatRemainingMs(snapshot.job.estimatedRemainingMs)}`;
  }, [snapshot.job.errorMessage, snapshot.job.estimatedRemainingMs, snapshot.job.status]);

  const handleCancel = async () => {
    setIsCancelling(true);
    setActionError(null);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/generation-jobs/${snapshot.job.id}/cancel`,
        {
          method: "POST",
        },
      );
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "GENERATION_JOB_CANCEL_FAILED");
      }

      router.push(`/interfaces/workbench?projectId=${projectId}&message=generation-cancelled`);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "取消生成失败");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleRestart = async () => {
    setIsRestarting(true);
    setActionError(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/generation-jobs`, {
        method: "POST",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "GENERATION_JOB_CREATE_FAILED");
      }

      if (payload.snapshot) {
        setSnapshot(payload.snapshot as GenerationSnapshot);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "重新开始生成失败");
    } finally {
      setIsRestarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#14121f] text-[#e5e0f3] selection:bg-[#d2bbff]/30">
      <AppTopbar
        sourcePage="generation"
        creditsLabel={creditsLabel}
        navItems={[
          { href: "/interfaces/create", label: "工作台", sourcePage: "generation" },
          { href: "/interfaces/projects", label: "项目", sourcePage: "generation" },
          { href: "/interfaces/explore", label: "素材库", sourcePage: "generation" },
        ]}
      />

      <main className="mx-auto max-w-6xl px-6 pb-32 pt-24">
        <div className="mb-16">
          <div className="relative flex items-center justify-between">
            <div className="absolute top-1/2 left-0 h-[2px] w-full -translate-y-1/2 bg-[#363342]" />
            <div className="absolute top-1/2 left-0 h-[2px] w-3/4 -translate-y-1/2 bg-gradient-to-r from-[#4CD7F6] to-[#7C3AED]" />
            {steps.map((step) => (
              <StepCircle
                key={step.label}
                label={step.label}
                state={step.state}
                number={step.number}
              />
            ))}
          </div>
        </div>

        <div className="mb-16 flex flex-col items-center text-center">
          <div className="relative mb-8 flex h-52 w-52 items-center justify-center">
            <svg className="h-full w-full">
              <circle
                className="text-[#363342]"
                cx="104"
                cy="104"
                fill="transparent"
                r="90"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="origin-center -rotate-90 text-[#d2bbff]"
                cx="104"
                cy="104"
                fill="transparent"
                r="90"
                stroke="currentColor"
                strokeDasharray="565.48"
                strokeDashoffset={565.48 - (565.48 * progress) / 100}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-5xl font-bold text-[#e5e0f3]">{progress}%</span>
              <span className="mt-2 flex items-center gap-1 text-sm font-medium text-[#4CD7F6]">
                {snapshot.job.status === "processing" ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {statusLabel}
              </span>
            </div>
          </div>

          <h2 className="font-display mb-2 text-2xl font-bold">正在合成您的视觉杰作</h2>
          <p className="max-w-md text-[#ccc3d8]">
            {etaText}
            <br />
            {snapshot.job.currentSceneNumber
              ? `正在生成第 ${snapshot.job.currentSceneNumber}/${totalScenes} 个分镜...`
              : snapshot.job.status === "completed"
                ? "所有分镜均已准备完成，可进入导出。"
                : "可返回工作台继续调整分镜与参数。"}
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-[#4a4455]/10 bg-[rgba(32,30,44,0.6)] p-8 backdrop-blur-[20px]">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: totalScenes }).map((_, index) => (
              <SceneCard
                key={`scene-${index}`}
                image={index < completedScenes ? snapshot.scenes[index]?.previewImageUrl : undefined}
                index={index}
                isActive={index === activeSceneIndex}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-[#4a4455]/10 bg-[rgba(32,30,44,0.6)] p-6 backdrop-blur-[20px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#ccc3d8]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#4CD7F6]" />
              实时生成日志
            </h3>
            <span className="font-mono text-[10px] text-[#958da1]">job:{snapshot.job.id.slice(-8)}</span>
          </div>

          <div className="max-h-40 space-y-2 overflow-y-auto pr-2 font-mono text-xs">
            {snapshot.logs.map((log) => (
              <div
                key={log.id}
                className={`flex gap-3 ${
                  log.level === "done"
                    ? "text-[#4CD7F6]"
                    : log.level === "active"
                      ? "font-bold text-[#d2bbff]"
                      : "text-[#958da1]/70"
                }`}
              >
                <span className="opacity-50">
                  [{new Date(log.createdAt).toLocaleTimeString()}]
                </span>
                <span className="flex items-center gap-2">
                  {log.level === "active" ? (
                    <LoaderCircle className="h-3 w-3 animate-spin" />
                  ) : null}
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        </div>

        {actionError ? (
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#ff8a80]/30 bg-[#ff8a80]/10 px-4 py-3 text-sm text-[#ffd7d1]">
            {actionError}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center gap-4">
          {snapshot.job.status === "processing" || snapshot.job.status === "pending" ? (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isCancelling}
              className="rounded-xl border border-[#4a4455]/30 px-12 py-3 font-medium text-[#ccc3d8] backdrop-blur-md transition-all duration-300 hover:border-[#ffb4ab]/50 hover:bg-[#ffb4ab]/5 hover:text-[#ffb4ab] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCancelling ? "正在取消..." : "取消生成"}
            </button>
          ) : (
            <Link
              href={`/interfaces/workbench?projectId=${projectId}`}
              className="rounded-xl border border-[#4a4455]/30 px-12 py-3 font-medium text-[#ccc3d8] backdrop-blur-md transition-all duration-300 hover:border-[#ffb4ab]/50 hover:bg-[#ffb4ab]/5 hover:text-[#ffb4ab]"
            >
              返回工作台
            </Link>
          )}

          {snapshot.job.status === "completed" ? (
            <Link
              href={`/interfaces/export?projectId=${projectId}`}
              className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-12 py-3 font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(76,215,246,0.6)]"
            >
              查看导出
            </Link>
          ) : snapshot.job.status === "cancelled" || snapshot.job.status === "failed" ? (
            <button
              type="button"
              onClick={handleRestart}
              disabled={isRestarting}
              className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-12 py-3 font-medium text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(76,215,246,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRestarting ? "正在重新开始..." : "重新开始生成"}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-12 py-3 font-medium text-white opacity-80 shadow-[0_0_20px_rgba(124,58,237,0.4)]"
            >
              渲染进行中
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
