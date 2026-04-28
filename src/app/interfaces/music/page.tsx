import type { Metadata } from "next";
import { Fragment } from "react";
import {
  Check,
  Sparkles,
} from "lucide-react";
import { PageNavigationDebug } from "@/components/debug/navigation-debug";
import { MusicOptionsPanel } from "@/components/interfaces/music-options-panel";
import { AppTopbar } from "@/components/site/app-topbar";
import { requireCurrentUser } from "@/lib/auth/session";
import { getCreditBadgeLabelForUser } from "@/lib/billing/service";
import { getProjectForUser } from "@/lib/mv/workflow";

export const metadata: Metadata = {
  title: "音乐选择 - MeloVision",
  description: "MeloVision music generation page",
};

const steps = [
  { number: "1", label: "描述", active: false, done: true },
  { number: "2", label: "音乐", active: true },
  { number: "3", label: "分镜" },
  { number: "4", label: "生成" },
  { number: "5", label: "导出" },
];

function MusicPageClient({
  project,
  projectId,
  message,
  warning,
}: {
  project: any;
  projectId: string;
  message?: string;
  warning?: string;
}) {
  return (
    <div className="flex flex-1 pt-16">
      <aside className="fixed top-16 bottom-20 left-0 hidden w-72 overflow-y-auto border-r border-[#4a4455]/10 bg-[#1c1a27] px-6 py-8 md:flex md:flex-col">
        <div className="mb-8">
          <h3 className="mb-2 text-xs uppercase tracking-widest text-[#ccc3d8]">
            Project Input
          </h3>
          <h2 className="mb-1 text-lg font-bold text-[#d2bbff]">{project.title}</h2>
          <p className="text-sm text-[#ccc3d8]">
            Project • Vibe: {project.musicStyle} + {project.visualStyle}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#ccc3d8]">
              Concept Description
            </h4>
            <p className="text-sm leading-relaxed text-[#e5e0f3]">
              {project.conceptPrompt}
            </p>
          </div>

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#ccc3d8]">
              Style Tags
            </h4>
            <div className="flex flex-wrap gap-2">
              <span
                className="rounded bg-[#363342] px-2 py-1 text-xs text-[#4cd7f6]"
              >
                {project.musicStyle}
              </span>
              <span
                className="rounded bg-[#363342] px-2 py-1 text-xs text-[#4cd7f6]"
              >
                {project.visualStyle}
              </span>
            </div>
          </div>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8 md:ml-72 md:px-12 md:py-10">
        <div className="mx-auto mb-12 flex w-full max-w-4xl items-center justify-between px-4">
          {steps.map((step, index) => (
            <Fragment key={step.label}>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                    step.active
                      ? "bg-[#7C3AED] text-white shadow-[0_0_20px_rgba(124,58,237,0.6)] ring-4 ring-[#7C3AED]/20 border-transparent"
                      : step.done
                        ? "bg-[#7C3AED] text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] border-transparent"
                        : "border-[#4a4455]/30 bg-[#2b2836] text-[#E5E0F3]/40"
                  }`}
                >
                  {step.done ? <Check className="h-4 w-4" /> : step.number}
                </div>
                <span
                  className={`text-xs font-medium ${
                    step.active
                      ? "font-bold text-[#D2BBFF]"
                      : step.done
                        ? "text-[#ccc3d8]"
                        : "text-[#E5E0F3]/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 ? (
                <div
                  className={`mt-[-2rem] h-px flex-1 ${
                    index === 0 ? "bg-[#4a4455]/20" : "bg-[#4a4455]/10"
                  }`}
                />
              ) : null}
            </Fragment>
          ))}
        </div>

        {warning && (
          <div className="mb-6 rounded-lg border border-[#ffb4ab]/20 bg-[#93000a]/10 p-4 text-sm text-[#ffd7d1]">
            {warning}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 p-4 text-sm text-[#34d399]">
            {message}
          </div>
        )}

        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-[#e5e0f3]">
            选择你最喜欢的曲目
          </h1>
          <p className="text-sm text-[#ccc3d8]">
            AI 已基于您的创意生成了 3 个初始版本，请试听并选择最契合的一首进入下一步。
          </p>
        </div>

        <MusicOptionsPanel projectId={projectId} options={project.musicOptions} />
      </main>
    </div>
  );
}

export default async function MusicPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string; message?: string; warning?: string }>;
}) {
  const user = await requireCurrentUser();
  const params = await searchParams;
  const creditsLabel = await getCreditBadgeLabelForUser(user.id);
  const projectId = params.projectId;
  const messageMap: Record<string, string> = {
    "music-selected": "已选择当前音乐版本，可以继续进入分镜阶段",
    "music-regenerated": "已重新生成 3 个音乐候选版本",
  };
  const warningMap: Record<string, string> = {
    "suno-credits-insufficient":
      "Suno 额度不足，当前展示的是模拟音乐候选，并未生成真实音乐。请充值后再次生成。",
    "suno-generation-failed":
      "Suno 音乐生成失败，当前展示的是模拟音乐候选。请稍后再试。",
  };
  const message = params.message ? messageMap[params.message] ?? params.message : undefined;
  const warning = params.warning ? warningMap[params.warning] ?? params.warning : undefined;

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const project = await getProjectForUser(user.id, projectId);
  
  if (!project) {
    throw new Error("Project not found");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#14121f] pb-24 text-[#e5e0f3]">
      <PageNavigationDebug pageName="music" />
      <AppTopbar
        sourcePage="music"
        creditsLabel={creditsLabel}
        navItems={[
          {
            href: "/interfaces/create",
            label: "工作台",
            active: true,
            debugLabel: "music-nav-workbench",
            sourcePage: "music",
          },
          {
            href: "/interfaces/projects",
            label: "项目",
            debugLabel: "music-nav-projects",
            sourcePage: "music",
          },
          {
            href: "/interfaces/explore",
            label: "素材库",
            debugLabel: "music-nav-explore",
            sourcePage: "music",
          },
        ]}
      />

      <MusicPageClient project={project} projectId={projectId} message={message} warning={warning} />
    </div>
  );
}
