import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  CircleUserRound,
  Compass,
  Plus,
  Radio,
  Users,
} from "lucide-react";
import { ExploreBrowser } from "@/components/interfaces/explore-browser";
import { PublicTopbar } from "@/components/site/public-topbar";
import { getExploreFeed } from "@/lib/explore/service";

export const metadata: Metadata = {
  title: "作品广场 - MeloVision",
  description: "MeloVision 作品广场",
};

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const feed = await getExploreFeed();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#14121f] text-[#e5e0f3]">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] [background-image:radial-gradient(#ffffff_0.6px,transparent_0.6px)] [background-size:12px_12px]" />

      <PublicTopbar activeNav="explore" sourcePage="explore" />

      <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t border-[#4a4455]/20 bg-[#14121f]/80 px-2 backdrop-blur-xl md:hidden">
        <Link className="flex flex-col items-center gap-1 text-[#d2bbff]" href="/interfaces/explore">
          <Compass className="h-5 w-5" />
          <span className="text-[10px] font-medium">Explore</span>
        </Link>
        <Link
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-[#4cd7f6]"
          href="/interfaces/projects"
        >
          <Users className="h-5 w-5" />
          <span className="text-[10px] font-medium">Community</span>
        </Link>
        <Link
          className="-mt-6 flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-[#4cd7f6]"
          href="/interfaces/create"
        >
          <div className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] p-3 text-white shadow-[0_4px_15px_rgba(124,58,237,0.4)]">
            <Plus className="h-5 w-5" />
          </div>
        </Link>
        <Link
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-[#4cd7f6]"
          href="/interfaces/generation"
        >
          <Radio className="h-5 w-5" />
          <span className="text-[10px] font-medium">Live</span>
        </Link>
        <Link
          className="flex flex-col items-center gap-1 text-slate-400 transition-colors hover:text-[#4cd7f6]"
          href="/interfaces/profile"
        >
          <CircleUserRound className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>

      <Suspense
        fallback={
          <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-28 text-center text-[#ccc3d8]">
            正在加载作品广场...
          </main>
        }
      >
        <ExploreBrowser
          filters={feed.filters}
          cards={feed.cards}
          hero={feed.hero}
          leaderboard={feed.leaderboard}
          trendingTags={feed.trendingTags}
        />
      </Suspense>
    </div>
  );
}
