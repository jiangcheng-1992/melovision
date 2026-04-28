import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Sparkles } from "lucide-react";
import { MarketingTopbar } from "@/components/site/marketing-topbar";
import {
  getPublicProjectDetail,
  getPublicProjectDetailAndTrackPlay,
} from "@/lib/explore/service";

type PageProps = {
  params: Promise<{
    projectId: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectId } = await params;
  const project = await getPublicProjectDetail(projectId);

  if (!project) {
    return {
      title: "作品不存在 - MeloVision",
    };
  }

  return {
    title: `${project.title} - 作品广场 - MeloVision`,
    description: project.conceptPrompt.slice(0, 140),
  };
}

export default async function ExploreProjectPage({ params }: PageProps) {
  const { projectId } = await params;
  const project = await getPublicProjectDetailAndTrackPlay(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#14121f] text-[#e5e0f3]">
      <MarketingTopbar
        sourcePage="explore"
        navItems={[
          { href: "/", label: "产品展示", sourcePage: "explore" },
          { href: "/interfaces/explore", label: "作品广场", active: true, sourcePage: "explore" },
          { href: "/interfaces/pricing", label: "价格方案", sourcePage: "explore" },
          { href: "/interfaces/create", label: "工作台", sourcePage: "explore" },
        ]}
        rightSlot={
          <Link
            href="/interfaces/create"
            className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.24)] transition-all duration-200 hover:scale-[1.02]"
          >
            创建我的 MV
          </Link>
        }
      />

      <main className="mx-auto max-w-6xl px-6 pb-20 pt-28">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="overflow-hidden rounded-3xl border border-[#4a4455]/20 bg-[#0e0c19]">
            <div className="relative aspect-[16/9]">
              <img
                alt={project.title}
                src={project.coverImageUrl}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14121f] via-[#14121f]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-[#14121f]/70 px-3 py-1 text-xs text-[#ccc3d8] backdrop-blur"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-3xl font-bold md:text-5xl">{project.title}</h1>
                  <p className="mt-3 max-w-3xl text-sm text-[#ccc3d8] md:text-base">
                    {project.conceptPrompt}
                  </p>
                </div>
                <Link
                  href="/interfaces/create"
                  className="inline-flex items-center gap-2 rounded-full bg-[#d2bbff] px-5 py-3 text-sm font-bold text-[#3f008e] transition-transform hover:scale-[1.02]"
                >
                  <Play className="h-4 w-4 fill-current" />
                  用这个灵感开始创作
                </Link>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-6">
              <div className="text-sm text-[#958da1]">创作者</div>
              <div className="mt-2 text-2xl font-bold">{project.creator}</div>
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#1c1a27] p-4">
                  <div className="text-xs text-[#958da1]">播放</div>
                  <div className="mt-2 text-xl font-semibold text-[#4cd7f6]">
                    {project.plays}
                  </div>
                </div>
                <div className="rounded-2xl bg-[#1c1a27] p-4">
                  <div className="text-xs text-[#958da1]">点赞</div>
                  <div className="mt-2 text-xl font-semibold text-[#ffb690]">
                    {project.likes}
                  </div>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-[#1c1a27] p-4">
                <div className="text-xs text-[#958da1]">音乐信息</div>
                <div className="mt-2 text-sm text-[#e5e0f3]">
                  时长 {project.duration}
                  {project.music ? ` · ${project.music.genre} · ${project.music.bpm} BPM` : ""}
                </div>
              </div>
            </div>

            {project.music ? (
              <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="h-4 w-4 text-[#d2bbff]" />
                  音乐设定
                </h2>
                <div className="mt-4 text-sm text-[#ccc3d8]">
                  <div className="font-medium text-white">{project.music.title}</div>
                  <p className="mt-2">{project.music.lyricSnippet}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.music.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#4a4455]/30 px-2.5 py-1 text-xs text-[#d2bbff]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </aside>
        </div>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold">分镜预览</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {project.scenes.map((scene) => (
              <div
                key={scene.id}
                className="overflow-hidden rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19]"
              >
                <div className="aspect-video overflow-hidden bg-[#1c1a27]">
                  <img
                    alt={`scene-${scene.sortOrder + 1}`}
                    src={scene.previewImageUrl}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-[#958da1]">
                    <span>Scene {scene.sortOrder + 1}</span>
                    <span>
                      {scene.startSec}s - {scene.endSec}s
                    </span>
                  </div>
                  <div className="text-sm font-medium text-white">{scene.lyricLine}</div>
                  <p className="mt-2 line-clamp-3 text-sm text-[#ccc3d8]">{scene.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
