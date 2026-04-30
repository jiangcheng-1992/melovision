import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  Plus,
} from "lucide-react";
import { ProjectsBrowser } from "@/components/interfaces/projects-browser";
import { ProjectsToolbarActions } from "@/components/interfaces/projects-toolbar-actions";
import { AppTopbar } from "@/components/site/app-topbar";
import { requireCurrentUser } from "@/lib/auth/session";
import { getCreditBadgeLabelForUser } from "@/lib/billing/service";
import { listProjectsForUser } from "@/lib/mv/workflow";

export const metadata: Metadata = {
  title: "我的项目 - MeloVision",
  description: "MeloVision projects page",
};

const tabs = ["全部", "草稿", "生成中", "已完成", "失败"];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const currentUser = await requireCurrentUser();
  const params = await searchParams;
  const successMessageMap: Record<string, string> = {
    "logged-in": "登录成功，欢迎回来",
    registered: "注册成功，欢迎加入 MeloVision",
  };
  const successMessage = params.auth ? successMessageMap[params.auth] : null;
  const creditsLabel = await getCreditBadgeLabelForUser(currentUser.id);
  
  const projects = await listProjectsForUser(currentUser.id);

  return (
    <div className="min-h-screen bg-[#14121f] font-sans text-[#e5e0f3] antialiased">
      <div className="fixed inset-0 -z-10 opacity-[0.05]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }} />

      <AppTopbar
        sourcePage="projects"
        creditsLabel={creditsLabel}
        navItems={[
          {
            href: "/interfaces/create",
            label: "工作台",
            debugLabel: "projects-nav-workbench",
            sourcePage: "projects",
          },
          {
            href: "/interfaces/projects",
            label: "项目",
            active: true,
            debugLabel: "projects-nav-projects",
            sourcePage: "projects",
          },
        ]}
        rightSlot={
          <ProjectsToolbarActions displayName={currentUser.displayName} />
        }
      />

      <main className="mx-auto mt-16 w-full max-w-[1600px] p-6 lg:p-8">
        {successMessage ? (
          <div className="mb-6 rounded-xl border border-[#4cd7f6]/20 bg-[#062230] px-5 py-4 text-sm text-[#b6eeff] shadow-[0_10px_30px_rgba(3,181,211,0.08)]">
            {successMessage}
          </div>
        ) : null}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-tight">
              我的项目{" "}
              <span className="text-2xl font-normal text-[#ccc3d8]">({projects.length})</span>
            </h1>
            <p className="mt-2 text-sm text-[#ccc3d8]">
              当前账号：{currentUser.displayName} · {currentUser.email}
            </p>
          </div>
          <Link
            href="/interfaces/create"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-6 py-2.5 font-medium transition-all hover:shadow-[0_0_20px_rgba(210,187,255,0.3)]"
          >
            <Plus className="h-4 w-4" />
            创建新 MV
          </Link>
        </div>

        <Suspense
          fallback={
            <div className="rounded-xl border border-[#4a4455]/20 bg-[#1c1a27] p-6 text-sm text-[#ccc3d8]">
              正在加载项目列表...
            </div>
          }
        >
          <ProjectsBrowser projects={projects} tabs={tabs} />
        </Suspense>
      </main>
    </div>
  );
}
