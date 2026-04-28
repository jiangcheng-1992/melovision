import type { Metadata } from "next";
import { PageNavigationDebug } from "@/components/debug/navigation-debug";
import { CreateForm } from "@/components/interfaces/create-form";
import { AppTopbar } from "@/components/site/app-topbar";
import { requireCurrentUser } from "@/lib/auth/session";
import { getCreditBadgeLabelForUser } from "@/lib/billing/service";
import { getProjectForUser } from "@/lib/mv/workflow";

export const metadata: Metadata = {
  title: "创作设定 - MeloVision",
  description: "MeloVision create page",
};

const visualStyles = [
  {
    name: "Cyberpunk",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCPz3bki_DrNoU_Gbn-xyEbOvRoVaCbaR_j5kycQL8a5PcRVev0BTN6qwJkLataQSLlykXxeq_YbwmieoUjnE3kYgch0m4jnFjZ8rp2b35zSOTFZj4xDm-xhzX1yndMgNNCvdaCpkIvi9_N2x88rOWPyvIq3tMwS-9mzJt0wbD8l78KZZme6tCU4Bxc8yeE7DSn1sWy1mUtm5IIzrDiYN7JE4nKw18e8Ss1d5rwj8kKd8L30xnjNfqNG2KVIbQ4fAyoKcaFfQe58w",
  },
  {
    name: "Anime",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAKoxsZZairBR3EawWK5fflPFwjDKDafiE6o3V0V27IMImrOj6msPy6RtexKycNPv1F20DRwHphqE3Up8vPEnJkk9POZaf3DAPI0oRSSMyXOi31vemmkd1lJ6NFqnjDYUx-dXTwTfVIKVekjfWz1sLXul8MFwUDuKtMUSwKg2ZkeiYJzZ0OaXQ2aX9KtJgs5dLsKt6NL8LmVrH1U-oV31tB3K31_j3WGH4Fdq5C5StcP_9O9oPwquTxyLiXB-aq6ougLmN-m5co7A",
  },
  {
    name: "Cinematic",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBbnmFkXUaIhBK6OR88gXGsxAd0Qx0DwJ0ys9t3i9Mg8vaKBrva21C0nSzb04d6UGO_EOT_c1ZE7stR_2UFuqtovi4VtcVsIfcH3lIXC3H-VOQjGKyncSX9WTvYskxHCEosEdW3Sp8FMJhkFbJdqehtMax0I5Ap-nLdKj7xDnIOk3tM1TppsKr8cgSg84_8Rq9B_jBpafJGOhSiJaHVSw9IJZa-MUC5h8TPKmI5MzJ8MtW0hsZ6d-i43fs6Z4Eyn0Lk7BaRpBBrmw",
  },
  {
    name: "水墨 (Ink)",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2mWTXcmplnqbjgE2DW04EWF81vijdO2MJF8mwTBRvcp-4Yj8ILxIkRI_vCKFkvf7qJfJIS-CBQ7DLcv9Wzh7aaBSxu0hHA0x2G8DTSboBOwMxia_cXuCWR1h-9HtRgUsp5ziOR05XzpcRwFxfkDkIciVAWS2H9bR1iQmlv2TKUmEAP_uSWDjoQ4QSXgcj2lomWJH7r-bSDFA7juX7DDJPsdxqHfgItv3vpI-qcnCsxGJtgYc7BojteFdMky5Yd4F-Db-s6Ywbjw",
  },
];

const musicStyles = ["Pop", "Rock", "Lo-fi", "国风", "Electronic"];

const steps = [
  { number: "1", label: "描述", active: true },
  { number: "2", label: "音乐" },
  { number: "3", label: "分镜" },
  { number: "4", label: "生成" },
  { number: "5", label: "导出" },
];

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; projectId?: string }>;
}) {
  const user = await requireCurrentUser();
  const params = await searchParams;
  const creditsLabel = await getCreditBadgeLabelForUser(user.id);
  const project = params.projectId
    ? await getProjectForUser(user.id, params.projectId)
    : null;

  return (
    <div className="relative min-h-screen bg-[#14121f] pb-32 text-[#e5e0f3] selection:bg-[#7c3aed] selection:text-white md:pb-24">
      <PageNavigationDebug pageName="create" />
      <div className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.04] [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%270_0_200_200%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27noiseFilter%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.65%27_numOctaves=%273%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23noiseFilter)%27/%3E%3C/svg%3E')]" />

      <AppTopbar
        sourcePage="create"
        creditsLabel={creditsLabel}
        navItems={[
          {
            href: "/interfaces/create",
            label: "工作台",
            active: true,
            debugLabel: "create-nav-workbench",
            sourcePage: "create",
          },
          {
            href: "/interfaces/projects",
            label: "项目",
            debugLabel: "create-nav-projects",
            sourcePage: "create",
          },
          {
            href: "/interfaces/explore",
            label: "素材库",
            debugLabel: "create-nav-explore",
            sourcePage: "create",
          },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 pt-24 pb-12 sm:px-6 md:pt-28">
        <div className="relative mb-8 flex items-center justify-between px-2 md:px-4">
          <div className="absolute top-1/2 right-8 left-8 hidden h-0.5 -translate-y-1/2 bg-[#1c1a27] md:block" />
          {steps.map((step, index) => (
            <div
              key={step.label}
              className={`flex flex-col items-center gap-2 ${step.active ? "" : "opacity-50"}`}
            >
              {step.active ? (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#7c3aed] text-xs font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] md:h-10 md:w-10 md:text-sm">
                  {step.number}
                </div>
              ) : (
                <>
                  <div className="mt-3 h-2 w-2 rounded-full bg-[#2b2836] md:hidden" />
                  <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-[#2b2836] text-sm text-[#e5e0f3] md:flex">
                    {step.number}
                  </div>
                </>
              )}
              <span
                className={`text-xs md:text-sm ${step.active ? "font-medium text-[#d2bbff]" : "hidden text-[#ccc3d8] md:block"}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mb-6 h-px w-full bg-gradient-to-r from-[#d2bbff]/30 via-transparent to-[#4cd7f6]/30 md:mb-8" />

        <CreateForm
          error={params.error}
          visualStyles={visualStyles}
          musicStyles={musicStyles}
          initialValues={
            project
              ? {
                  projectId: project.id,
                  title: project.title,
                  conceptPrompt: project.conceptPrompt,
                  customLyrics: project.customLyrics ?? undefined,
                  visualStyle: project.visualStyle,
                  musicStyle: project.musicStyle,
                  musicGenerationMode: project.customLyrics ? "song" : "song",
                  consistencyBoost: project.storyboardSettings?.consistencyBoost ?? true,
                }
              : undefined
          }
        />
      </main>
    </div>
  );
}
