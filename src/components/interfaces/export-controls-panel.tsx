"use client";

import {
  ChevronDown,
  Download,
  Link2,
  Share2,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { InteractiveButton } from "@/components/debug/interactive-button";

const subtitleStyles = [
  "发光霓虹 (Neon Glow)",
  "极简白字 (Minimal Clean)",
  "复古字幕 (Retro Tape)",
];

const resolutionOptions = ["720p", "1080p HD"] as const;

function openExternalUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

type ProjectType = {
  id: string;
  title: string;
  subtitleStyle: string;
  fontSize: number;
  exportResolution: string;
  published: boolean;
  coverVersion: number;
  coverImageUrl?: string | null;
};

export function ExportControlsPanel({ project }: { project: ProjectType }) {
  const [subtitleStyleIndex, setSubtitleStyleIndex] = useState(
    subtitleStyles.findIndex((style) => style === project.subtitleStyle) || 0
  );
  const [fontSize, setFontSize] = useState(project.fontSize);
  const [resolution, setResolution]
    = useState<(typeof resolutionOptions)[number]>(project.exportResolution as any);
  const [published, setPublished] = useState(project.published);
  const [coverVersion, setCoverVersion] = useState(project.coverVersion);
  const [lastShareAction, setLastShareAction] = useState("尚未分享");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const fontSizeLabel = useMemo(() => {
    if (fontSize < 40) return "小";
    if (fontSize < 75) return "中";
    return "大";
  }, [fontSize]);

  async function handleDownload() {
    setIsExporting(true);
    setExportError(null);

    try {
      const response = await fetch(`/api/projects/${project.id}/export-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resolution,
          subtitleStyle: subtitleStyles[subtitleStyleIndex],
          fontSize,
          published,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "导出任务创建失败");
      }

      setLastShareAction(`已生成 ${resolution} 导出文件`);
      const link = document.createElement("a");
      link.href = payload.downloadUrl;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "导出失败");
    } finally {
      setIsExporting(false);
    }
  }

  const shareTarget = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/interfaces/explore/${project.id}`;
  }, [project.id]);

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareTarget);
    setLastShareAction("已复制作品链接");
  }

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border border-[#4a4455]/10 bg-[#201e2c] p-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#7c3aed]/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-[#e5e0f3]">
          <Sparkles className="h-5 w-5 text-[#d2bbff]" />
          个性化设置
        </h2>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#ccc3d8]">
              字幕样式
            </label>
            <InteractiveButton
              type="button"
              actionId="export-subtitle-style"
              sourcePage="export"
              onClick={() =>
                setSubtitleStyleIndex(
                  (current) => (current + 1) % subtitleStyles.length,
                )
              }
              className="flex w-full items-center justify-between rounded-lg border border-[#4a4455]/30 bg-[#0e0c19] p-3 text-left transition-colors hover:border-[#d2bbff]/50"
            >
              <span className="text-sm">{subtitleStyles[subtitleStyleIndex]}</span>
              <ChevronDown className="h-4 w-4 text-[#ccc3d8]" />
            </InteractiveButton>
          </div>

          <div>
            <label className="mb-2 flex justify-between text-sm font-medium text-[#ccc3d8]">
              <span>字体大小</span>
              <span className="text-xs text-[#d2bbff]">{fontSizeLabel}</span>
            </label>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={fontSize}
              onChange={(event) => setFontSize(Number(event.target.value))}
              className="w-full accent-[#4cd7f6]"
            />
          </div>

          <div className="border-t border-[#2b2836] pt-2">
            <label className="mb-3 block text-sm font-medium text-[#ccc3d8]">
              封面预览
            </label>
            <div className="flex items-center gap-4">
              <img
                alt="Cover Preview"
                className="h-20 w-20 rounded-lg border border-[#4a4455]/30 object-cover"
                src={project.coverImageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuB8GP6JfXX-wtKpAvGn5hOTaWk8qrAlZfHiUISnYl_LWupInGkFepg7_eaRMUdufU2BX_1boGe3xnmKgW3LDuMh0SfxjS5kgJ8u_XWa07EG1o8NNri8O2yhxcDScJV8JB1dTgLzanT48aSi5CE4eCY-RMLvQYuzq4h17GJL4wTw5D7hNVaTshtWzTlpwxOiYWUQJ8iiUhgVZQy3EqbBoF421un6jWp_wIk9exz3QWP8IUGlMPQ7s8G1cXIhPLzmnfhe4DPXPS5gXA"}
              />
              <div className="flex flex-1 flex-col gap-2">
                <InteractiveButton
                  type="button"
                  actionId="export-regenerate-cover"
                  sourcePage="export"
                  onClick={() => setCoverVersion((current) => current + 1)}
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#4a4455]/20 bg-[#0e0c19] px-4 py-2 text-sm font-medium transition-colors hover:bg-[#363342]"
                >
                  <Sparkles className="h-4 w-4" />
                  重新生成封面
                </InteractiveButton>
                <p className="text-xs text-[#958da1]">当前封面版本 V{coverVersion}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-1">
        <div className="relative overflow-hidden rounded-xl border border-[#4cd7f6]/10 bg-[rgba(43,40,54,0.8)] p-6 backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#4cd7f6]/10 blur-[30px]" />
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#e5e0f3]">
            <Download className="h-5 w-5 text-[#4cd7f6]" />
            导出视频
          </h2>
          <div className="mb-3 text-xs text-[#958da1]">
            当前导出配置：{resolution} · {subtitleStyles[subtitleStyleIndex]}
          </div>
          {exportError ? (
            <div className="mb-3 rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/10 px-3 py-2 text-xs text-[#fca5a5]">
              {exportError}
            </div>
          ) : null}
          <div className="mb-6 flex gap-2">
            {resolutionOptions.map((option) => (
              <InteractiveButton
                key={option}
                type="button"
                actionId={`export-resolution-${option}`}
                sourcePage="export"
                onClick={() => setResolution(option)}
                className={`flex-1 rounded-lg py-2 text-sm transition-all ${
                  resolution === option
                    ? "border border-[#4cd7f6]/30 bg-[#4cd7f6]/10 font-medium text-[#4cd7f6] shadow-[inset_0_0_10px_rgba(76,215,246,0.1)]"
                    : "bg-[#0e0c19] text-[#ccc3d8] hover:border hover:border-[#4a4455]/30"
                }`}
              >
                {option}
              </InteractiveButton>
            ))}
            <button
              disabled
              className="w-16 cursor-not-allowed rounded-lg bg-[#0e0c19] py-2 text-sm text-[#ccc3d8] opacity-50"
            >
              MP4
            </button>
          </div>
          <InteractiveButton
            type="button"
            actionId="export-download-video"
            sourcePage="export"
            onClick={handleDownload}
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.3)] transition-all duration-300 ${
              isExporting
                ? "cursor-wait bg-[#4a4455]"
                : "bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] hover:-translate-y-0.5 hover:shadow-[0_4px_30px_rgba(3,181,211,0.4)]"
            }`}
          >
            {isExporting ? "正在生成导出文件..." : `下载 ${resolution}`}
            <Download className="h-5 w-5" />
          </InteractiveButton>
        </div>

        <div className="rounded-xl border border-[#4a4455]/10 bg-[#201e2c] p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-[#e5e0f3]">
              <Share2 className="h-5 w-5 text-[#ffb690]" />
              发布与分享
            </h2>
            <InteractiveButton
              type="button"
              actionId="export-publish-toggle"
              sourcePage="export"
              onClick={() => setPublished((current) => !current)}
              className={`relative h-5 w-10 rounded-full border transition-colors ${
                published
                  ? "border-[#d2bbff]/30 bg-[#d2bbff]/20"
                  : "border-[#4a4455]/30 bg-[#0e0c19]"
              }`}
            >
              <div
                className={`absolute top-0.5 h-4 w-4 rounded-full shadow-sm transition-all ${
                  published ? "right-0.5 bg-[#d2bbff]" : "left-0.5 bg-[#958da1]"
                }`}
              />
            </InteractiveButton>
          </div>
          <p className="mb-2 text-sm text-[#ccc3d8]">
            {published ? "已开启自动发布，可一键同步到社区。" : "当前为仅保存到作品库。"}
          </p>
          <p className="mb-4 text-xs text-[#958da1]">最近一次分享：{lastShareAction}</p>
          <div className="flex gap-3">
            <InteractiveButton
              type="button"
              actionId="export-copy-link"
              sourcePage="export"
              onClick={handleCopyLink}
              className="rounded-lg border border-[#4a4455]/10 bg-[#0e0c19] p-2.5 text-[#e5e0f3] transition-colors hover:bg-[#363342]"
            >
              <Link2 className="h-4 w-4" />
            </InteractiveButton>
            <InteractiveButton
              type="button"
              actionId="export-share-x"
              sourcePage="export"
              onClick={() => {
                const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  "我刚用 MeloVision 生成了一支 MV，来看看！",
                )}&url=${encodeURIComponent(shareTarget)}`;
                openExternalUrl(tweetUrl);
                setLastShareAction("已打开推特分享页");
              }}
              className="rounded-lg border border-[#4a4455]/10 bg-[#0e0c19] px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[#363342]"
            >
              推特
            </InteractiveButton>
            <InteractiveButton
              type="button"
              actionId="export-share-youtube"
              sourcePage="export"
              onClick={() => {
                openExternalUrl("https://studio.youtube.com/");
                setLastShareAction("已打开 YouTube Studio");
              }}
              className="rounded-lg border border-[#4a4455]/10 bg-[#0e0c19] px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[#363342]"
            >
              油管
            </InteractiveButton>
            <InteractiveButton
              type="button"
              actionId="export-share-bilibili"
              sourcePage="export"
              onClick={() => {
                openExternalUrl("https://member.bilibili.com/platform/upload/video/frame");
                setLastShareAction("已打开 B站投稿页");
              }}
              className="rounded-lg border border-[#4a4455]/10 bg-[#0e0c19] px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-[#363342]"
            >
              B站
            </InteractiveButton>
          </div>
        </div>
      </div>
    </>
  );
}
