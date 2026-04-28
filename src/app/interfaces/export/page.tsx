import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
} from "lucide-react";
import { ExportControlsPanel } from "@/components/interfaces/export-controls-panel";
import { ExportPreviewPlayer } from "@/components/interfaces/export-preview-player";
import { AppTopbar } from "@/components/site/app-topbar";
import { requireCurrentUser } from "@/lib/auth/session";
import { getCreditBadgeLabelForUser } from "@/lib/billing/service";
import { getProjectForUser, formatMusicDuration } from "@/lib/mv/workflow";

export const metadata: Metadata = {
  title: "预览与导出 - MeloVision",
  description: "MeloVision export page",
};

const steps = [
  { label: "描述", done: true },
  { label: "音乐", done: true },
  { label: "分镜", done: true },
  { label: "生成", done: true },
  { label: "导出", active: true },
];

export default async function ExportPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const currentUser = await requireCurrentUser();
  const params = await searchParams;
  const projectId = params.projectId;
  const creditsLabel = await getCreditBadgeLabelForUser(currentUser.id);

  if (!projectId) {
    return (
      <div className="min-h-screen bg-[#14121f] font-sans text-[#e5e0f3] antialiased selection:bg-[#7c3aed] selection:text-white">
        <AppTopbar
          sourcePage="export"
          creditsLabel={creditsLabel}
          navItems={[
            { href: "/interfaces/create", label: "工作台", sourcePage: "export" },
            { href: "/interfaces/projects", label: "项目", sourcePage: "export" },
            { href: "/interfaces/explore", label: "素材库", sourcePage: "export" },
          ]}
          className="sticky"
        />
        <main className="mx-auto flex max-w-[1440px] flex-1 flex-col items-center justify-center px-6 py-8 md:px-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#e5e0f3]">项目未找到</h1>
            <p className="mt-4 text-[#ccc3d8]">请从项目列表中选择一个已完成的项目进行导出</p>
            <Link
              href="/interfaces/projects"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-colors hover:bg-[#8a4cff]"
            >
              前往我的项目
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const project = await getProjectForUser(currentUser.id, projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#14121f] font-sans text-[#e5e0f3] antialiased selection:bg-[#7c3aed] selection:text-white">
        <AppTopbar
          sourcePage="export"
          creditsLabel={creditsLabel}
          navItems={[
            { href: "/interfaces/create", label: "工作台", sourcePage: "export" },
            { href: "/interfaces/projects", label: "项目", sourcePage: "export" },
            { href: "/interfaces/explore", label: "素材库", sourcePage: "export" },
          ]}
          className="sticky"
        />
        <main className="mx-auto flex max-w-[1440px] flex-1 flex-col items-center justify-center px-6 py-8 md:px-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#e5e0f3]">项目未找到</h1>
            <p className="mt-4 text-[#ccc3d8]">您没有权限访问此项目或项目不存在</p>
            <Link
              href="/interfaces/projects"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-colors hover:bg-[#8a4cff]"
            >
              前往我的项目
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const selectedMusic = project.musicOptions.find((item) => item.id === project.selectedMusicOptionId);
  const duration = selectedMusic ? formatMusicDuration(selectedMusic.durationSec) : "3:12";
  const tags = [
    selectedMusic?.genre || project.musicStyle,
    project.visualStyle,
    duration,
    project.exportResolution,
  ];

  return (
    <div className="min-h-screen bg-[#14121f] font-sans text-[#e5e0f3] antialiased selection:bg-[#7c3aed] selection:text-white">
      <AppTopbar
        sourcePage="export"
        creditsLabel={creditsLabel}
        navItems={[
          { href: "/interfaces/create", label: "工作台", sourcePage: "export" },
          { href: "/interfaces/projects", label: "项目", sourcePage: "export" },
          { href: "/interfaces/explore", label: "素材库", sourcePage: "export" },
        ]}
        className="sticky"
      />

      <div className="sticky top-16 z-40 w-full border-b border-[#4a4455]/20 bg-[rgba(20,18,31,0.8)] backdrop-blur-[20px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="border-t border-[#4a4455]/10 px-6 py-6 md:px-10">
            <div className="relative mx-auto flex max-w-4xl items-center justify-between">
              <div className="absolute top-[18px] left-0 z-0 h-[2px] w-full bg-[#4a4455]/20" />
              <div className="absolute top-[18px] left-0 z-0 h-[2px] w-full bg-gradient-to-r from-[#4CD7F6] to-[#7C3AED]" />
              {steps.map((step) => (
                <div key={step.label} className="relative z-10 flex flex-col items-center gap-3">
                  {step.active ? (
                    <div className="mt-[-2px] flex h-10 w-10 items-center justify-center rounded-full bg-[#7C3AED] shadow-[0_0_20px_rgba(124,58,237,0.6)]">
                      <span className="text-lg font-bold text-white">5</span>
                    </div>
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4CD7F6] shadow-[0_0_15px_rgba(76,215,246,0.4)]">
                      <Check className="h-5 w-5 font-bold text-black" />
                    </div>
                  )}
                  <span
                    className={`text-xs font-medium ${
                      step.active ? "font-bold text-[#d2bbff]" : "text-[#ccc3d8]"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex max-w-[1440px] flex-1 flex-col px-6 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="flex flex-col gap-6 xl:col-span-7">
            <ExportPreviewPlayer
              title={project.title}
              visualStyle={project.visualStyle}
              durationLabel={duration}
              videoUrl={project.generatedVideoUrl}
              soundtrackUrl={
                selectedMusic
                  ? `/api/projects/${project.id}/music-options/${selectedMusic.id}/audio`
                  : undefined
              }
              imageUrl={
                project.coverImageUrl ||
                selectedMusic?.artworkUrl ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuC-IFJF1uA2sILcaHTWcap0b1Zcpwk5NC4kecxksehUJOIY2mTm4AfMyjxhwXj7fUBE2JANz2ZO3xak7gWJfsML9IZK6_b39fpF4QAzQUGCpOzYyXjmr_dmYCCpZuIaaaOjfCv1saQVnQ7iKGTtXSXPzkw8Gwd4OvuYprztZdofzggUDOR2Tt3ycbx28Kv0iTkzrsFYd4nhjPrjZj_NV96lkhrGD45VraA534_5_lcJ7cHZAu4cde-Lmp915cRD5zzefnGrDL-Sqw"
              }
            />

            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#4a4455]/30">
                  <img
                    alt="Cover Art"
                    className="h-full w-full object-cover"
                    src={project.coverImageUrl || selectedMusic?.artworkUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuDnjCa48VY4oBLtSRKRolL4j4E4BhUMAyRxCuuZkYB_ARYYL0ON4LCFtc_Nx9K464But8CBIipe_cgVyTcl1jkh9I_LBHvrxMP5cGBGl82F1oN9Mfv9wfirc8IExooHX2R6es5iU4o5v0FO6DFdfe65HIJT_SX92AZzf1twN6jeK0y09MNI1VrnQHeaWl7pdbOi69rHy-gQuhX9DCPaxnjuW88hG3CvMQjlcPRgqXP10Mayv442fXLy_1xT-kdRqLngrY9RZ_YqLQ"}
                  />
                </div>
                <div>
                  <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#e5e0f3]">
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={tag}
                        className={`rounded-md border px-2.5 py-1 text-xs font-medium ${
                          index === 3
                            ? "border-[#4cd7f6]/20 bg-[#1c1a27] text-[#4cd7f6]"
                            : "border-[#4a4455]/10 bg-[#1c1a27] text-[#ccc3d8]"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 xl:col-span-5">
            <ExportControlsPanel project={project} />

            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-xs text-[#ccc3d8]/60">创建于: {project.createdAt.toLocaleDateString()}</span>
              <span className="text-xs text-[#ccc3d8]/60">
                消耗算力: <strong className="text-[#d2bbff]/80">15 Credits</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="relative mt-12 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-[#4cd7f6]/20 bg-gradient-to-r from-[#201e2c] to-[#2b2836] p-8 shadow-[0_0_40px_rgba(76,215,246,0.05)] md:flex-row">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#d2bbff] via-[#4cd7f6] to-[#d2bbff]" />
          <div className="z-10 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4cd7f6]/20">
              <CheckCircle2 className="h-6 w-6 text-[#4cd7f6]" />
            </div>
            <div>
              <h3 className="mb-1 text-xl font-bold text-white">
                🎉 恭喜！您的 MV 已准备就绪。
              </h3>
              <p className="text-sm text-[#ccc3d8]">
                文件已自动保存至你的云端素材库。
              </p>
            </div>
          </div>

          <div className="z-10 flex w-full items-center gap-4 md:w-auto">
            <Link
              href="/interfaces/projects"
              className="flex-1 whitespace-nowrap rounded-lg border border-[#4a4455]/30 px-6 py-2.5 text-center text-sm font-medium transition-colors hover:bg-[#363342] md:flex-none"
            >
              前往我的作品
            </Link>
            <Link
              href="/interfaces/create"
              className="flex-1 whitespace-nowrap rounded-lg bg-[#7c3aed] px-6 py-2.5 text-center text-sm font-bold text-white shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-colors hover:bg-[#8a4cff] md:flex-none"
            >
              创建新 MV
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
