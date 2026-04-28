"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Crown, Play, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DebugLink } from "@/components/debug/navigation-debug";
import { InteractiveButton } from "@/components/debug/interactive-button";

type ExploreCard = {
  id: string;
  href: string;
  title: string;
  creator: string;
  creatorInitial: string;
  creatorAvatar: string;
  tag: string;
  tags: string[];
  duration: string;
  likes: string;
  plays: string;
  likeCount: number;
  playCount: number;
  image: string;
  accent: string;
  summary: string;
  updatedAt: string;
};

type LeaderboardItem = {
  rank: string;
  name: string;
  count: string;
  color: string;
  image: string;
};

type TrendingTag = {
  label: string;
  color: string;
};

const DEFAULT_EXPLORE_FILTER = "全部";
const DEFAULT_EXPLORE_VISIBLE_COUNT = 6;

function parseMetric(value: string) {
  if (value.endsWith("K")) return Number.parseFloat(value) * 1000;
  return Number.parseFloat(value);
}

function StatCardAvatar({ name, image }: { name: string; image: string }) {
  if (image) {
    return (
      <img
        alt={name}
        src={image}
        className="h-10 w-10 rounded-full border border-white/10 object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#201e2c] text-sm font-bold text-white">
      {name.slice(0, 1)}
    </div>
  );
}

export function ExploreBrowser({
  filters,
  cards,
  hero,
  leaderboard,
  trendingTags,
}: {
  filters: string[];
  cards: ExploreCard[];
  hero: ExploreCard | null;
  leaderboard: LeaderboardItem[];
  trendingTags: TrendingTag[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(DEFAULT_EXPLORE_FILTER);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(DEFAULT_EXPLORE_VISIBLE_COUNT);

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const nextFilter = filters.includes(searchParams.get("filter") ?? "")
      ? (searchParams.get("filter") as string)
      : DEFAULT_EXPLORE_FILTER;
    const nextTag = trendingTags.some(
      (tag) => tag.label === searchParams.get("tag"),
    )
      ? searchParams.get("tag")
      : null;
    const rawCount = Number.parseInt(
      searchParams.get("count") ?? `${DEFAULT_EXPLORE_VISIBLE_COUNT}`,
      10,
    );
    const nextCount =
      Number.isFinite(rawCount) && rawCount >= DEFAULT_EXPLORE_VISIBLE_COUNT
        ? rawCount
        : DEFAULT_EXPLORE_VISIBLE_COUNT;

    if (query !== nextQuery) setQuery(nextQuery);
    if (activeFilter !== nextFilter) setActiveFilter(nextFilter);
    if (activeTag !== nextTag) setActiveTag(nextTag);
    if (visibleCount !== nextCount) setVisibleCount(nextCount);
  }, [
    activeFilter,
    activeTag,
    filters,
    query,
    searchParams,
    trendingTags,
    visibleCount,
  ]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (query.trim()) nextParams.set("q", query.trim());
    else nextParams.delete("q");

    if (activeFilter !== DEFAULT_EXPLORE_FILTER) nextParams.set("filter", activeFilter);
    else nextParams.delete("filter");

    if (activeTag) nextParams.set("tag", activeTag);
    else nextParams.delete("tag");

    if (visibleCount !== DEFAULT_EXPLORE_VISIBLE_COUNT) {
      nextParams.set("count", `${visibleCount}`);
    } else {
      nextParams.delete("count");
    }

    const nextQueryString = nextParams.toString();
    const currentQueryString = searchParams.toString();

    if (nextQueryString !== currentQueryString) {
      router.replace(
        nextQueryString ? `${pathname}?${nextQueryString}` : pathname,
        { scroll: false },
      );
    }
  }, [
    activeFilter,
    activeTag,
    pathname,
    query,
    router,
    searchParams,
    visibleCount,
  ]);

  const filteredCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let nextCards = cards.filter((card) => {
      const matchesFilter =
        activeFilter === "全部" ||
        activeFilter === "热门 🔥" ||
        activeFilter === "最新" ||
        activeFilter === "最多点赞" ||
        card.tag === activeFilter;

      const matchesTag =
        !activeTag ||
        card.title.includes(activeTag) ||
        card.tag.includes(activeTag) ||
        card.tags.some((tag) => tag.includes(activeTag));

      const matchesQuery =
        !normalizedQuery ||
        [card.title, card.creator, card.tag]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesTag && matchesQuery;
    });

    if (activeFilter === "热门 🔥" || activeFilter === "最多点赞") {
      nextCards = [...nextCards].sort(
        (left, right) => parseMetric(right.likes) - parseMetric(left.likes),
      );
      } else if (activeFilter === "最新") {
        nextCards = [...nextCards].sort(
          (left, right) =>
            new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
        );
    }

    return nextCards;
  }, [activeFilter, activeTag, cards, query]);

  const visibleCards = filteredCards.slice(0, visibleCount);

  return (
    <main className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-8 overflow-x-clip px-4 pb-24 pt-24 md:px-8 md:pb-20 xl:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-8">
        <div className="w-full lg:hidden">
          <div className="flex w-full items-center rounded-full border border-[#4a4455]/30 bg-[#1c1a27] px-4 py-3">
            <Search className="mr-2 h-4 w-4 text-[#958da1]" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索 MV、风格或创作人..."
              className="w-full bg-transparent text-sm text-[#e5e0f3] outline-none placeholder:text-[#958da1]"
            />
          </div>
        </div>

        {hero ? (
          <section className="group relative h-[300px] min-w-0 overflow-hidden rounded-2xl border border-[#4a4455]/20 md:h-[400px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${hero.image}')`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#14121f] via-[#14121f]/60 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 flex w-full flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-end sm:gap-6 md:p-8">
              <div className="flex flex-col gap-2 md:gap-3">
                <span className="w-max rounded-full bg-[#201e2c]/80 px-3 py-1 text-[10px] uppercase tracking-widest text-[#4cd7f6] backdrop-blur-sm md:text-sm">
                  本周精选作品
                </span>
                <h1 className="break-words text-3xl font-bold leading-tight md:text-5xl">
                  {hero.title}
                </h1>
                <p className="max-w-2xl text-sm text-[#ccc3d8] md:text-base">
                  {hero.summary}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 md:mt-2 md:gap-4">
                  <div className="flex items-center gap-2">
                    {hero.creatorAvatar ? (
                      <img
                        alt={hero.creator}
                        src={hero.creatorAvatar}
                        className="h-6 w-6 rounded-full border border-[#d2bbff]/50 object-cover md:h-8 md:w-8"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#201e2c] text-xs font-bold text-white md:h-8 md:w-8">
                        {hero.creatorInitial}
                      </div>
                    )}
                    <span className="text-xs font-medium text-[#ccc3d8] md:text-sm">
                      {hero.creator}
                    </span>
                  </div>
                  <span className="hidden text-sm text-[#958da1] sm:inline">•</span>
                  <span className="flex flex-wrap gap-2 text-sm text-[#4a4455]">
                    {hero.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[#201e2c] px-2 py-0.5 text-[10px] text-[#ccc3d8] md:text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </div>
              </div>

              <DebugLink
                href={hero.href}
                label="explore-hero-play"
                sourcePage="explore"
                className="flex whitespace-nowrap rounded-full bg-[#d2bbff] px-4 py-2 text-sm font-bold text-[#3f008e] transition-all duration-200 hover:scale-[1.02] active:scale-95 md:px-6 md:py-3 md:text-base"
              >
                <span className="mr-1 md:mr-2">
                  <Play className="h-5 w-5 fill-current" />
                </span>
                立即播放
              </DebugLink>
            </div>

            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
              <div className="h-1 w-6 rounded-full bg-[#d2bbff] md:w-8" />
              <div className="h-1 w-2 rounded-full bg-[#4a4455]" />
              <div className="h-1 w-2 rounded-full bg-[#4a4455]" />
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-dashed border-[#4a4455]/30 bg-[#0e0c19] p-10 text-center text-[#958da1]">
            暂无公开作品，先去创建并导出一个可发布项目吧。
          </section>
        )}

        <div className="my-1 h-px w-full bg-gradient-to-r from-[#7c3aed]/40 via-transparent to-[#4cd7f6]/40 md:my-2" />

        <section className="scrollbar-hide flex snap-x gap-2 overflow-x-auto pb-2 md:gap-3 md:pb-4">
          {filters.map((filter) => (
            <InteractiveButton
              key={filter}
              type="button"
              actionId={`explore-filter-${filter}`}
              sourcePage="explore"
              onClick={() => {
                setActiveFilter(filter);
                if (filter === "全部") {
                  setActiveTag(null);
                }
              }}
              className={`snap-start whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium md:px-5 md:py-2 md:text-sm ${
                activeFilter === filter
                  ? "border border-[#d2bbff]/30 bg-[#2b2836] text-[#d2bbff]"
                  : "bg-[#201e2c] text-[#ccc3d8] transition-colors hover:bg-[#2b2836]"
              }`}
            >
              {filter}
            </InteractiveButton>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleCards.map((card) => (
            <DebugLink
              key={card.id}
              href={card.href}
              label={`explore-card-${card.title}`}
              sourcePage="explore"
              className="group overflow-hidden rounded-2xl bg-[#201e2c] transition-all duration-300 hover:-translate-y-1 hover:ring-1 hover:ring-[#d2bbff]/50 hover:shadow-[0_8px_30px_rgba(124,58,237,0.15)]"
            >
              <div className="relative aspect-video">
                <img alt={card.title} src={card.image} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="scale-90 rounded-full bg-[#d2bbff]/90 p-3 text-[#3f008e] backdrop-blur-sm transition-transform group-hover:scale-100">
                    <Play className="h-5 w-5 fill-current" />
                  </div>
                </div>
                <div className="absolute right-2 bottom-2 rounded bg-[#14121f]/80 px-2 py-1 text-xs text-[#e5e0f3]">
                  {card.duration}
                </div>
              </div>

              <div className="flex flex-col gap-3 p-4">
                <h3 className="truncate text-lg font-bold leading-tight">{card.title}</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {card.creatorAvatar ? (
                      <img
                        alt={card.creator}
                        src={card.creatorAvatar}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[#d2bbff] to-[#ffb690] text-[10px] font-bold text-[#3f008e]">
                        {card.creatorInitial}
                      </div>
                    )}
                    <span className="text-xs text-[#ccc3d8]">{card.creator}</span>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${card.accent}`}>
                    {card.tag}
                  </span>
                </div>
                <div className="flex items-center gap-4 border-t border-[#363342] pt-2 text-xs text-[#958da1]">
                  <span className="flex items-center gap-1">
                    <span className="text-[10px] text-[#ff7d73]">❤️</span>
                    {card.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="h-4 w-4 fill-current" />
                    {card.plays}
                  </span>
                </div>
              </div>
            </DebugLink>
          ))}
        </div>

        <div className="mt-2 flex justify-center md:mt-4">
          <InteractiveButton
            type="button"
            actionId="explore-load-more"
            sourcePage="explore"
            disabled={visibleCount >= filteredCards.length}
            onClick={() => setVisibleCount((current) => current + 3)}
            className={`rounded-full border border-[#4a4455]/20 px-6 py-3 text-sm font-medium transition-all duration-200 active:scale-95 md:text-base ${
              visibleCount >= filteredCards.length
                ? "cursor-not-allowed bg-[#201e2c] text-[#958da1]"
                : "bg-[#2b2836] hover:scale-[1.02] hover:bg-[#363342]"
            }`}
          >
            {visibleCount >= filteredCards.length ? "已加载全部" : "加载更多"}
          </InteractiveButton>
        </div>
      </div>

      <div className="hidden w-px self-stretch bg-gradient-to-b from-[#7c3aed]/30 via-transparent to-[#4cd7f6]/30 xl:block" />

      <aside className="flex w-full min-w-0 shrink-0 flex-col gap-6 md:gap-8 xl:w-80">
        <div className="group relative overflow-hidden rounded-2xl border border-[#d2bbff]/20 bg-gradient-to-br from-[#7c3aed]/40 to-[#0e0c19] p-6">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#4cd7f6]/20 blur-3xl transition-colors group-hover:bg-[#4cd7f6]/30" />
          <h3 className="relative z-10 text-xl font-bold">开启你的创作</h3>
          <p className="relative z-10 mt-2 mb-6 text-sm text-[#ccc3d8]">
            将你的音乐灵感转化为震撼的视觉盛宴。
          </p>
          <DebugLink
            href="/interfaces/create"
            label="explore-create-mv"
            sourcePage="explore"
            className="relative z-10 block w-full rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] py-3 text-center text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] active:scale-95 md:text-base"
          >
            立即生成 MV
          </DebugLink>
        </div>

        <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-6">
          <h3 className="mb-6 flex items-center justify-between text-lg font-bold">
            本周创作者榜单
            <Crown className="h-4 w-4 text-[#4cd7f6]" />
          </h3>
          <div className="flex flex-col gap-5">
            {leaderboard.map((item) => (
              <div key={item.rank} className="flex items-center gap-3">
                <span className={`w-4 text-center text-sm font-bold ${item.color}`}>
                  {item.rank}
                </span>
                <StatCardAvatar name={item.name} image={item.image} />
                <div className="flex-1">
                  <div className="text-sm font-bold">{item.name}</div>
                  <div className="text-xs text-[#958da1]">{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-6">
          <h3 className="mb-4 text-lg font-bold">热门风格</h3>
          <div className="mb-3 text-xs text-[#958da1]">
            当前筛选：
            <span className="ml-1 text-[#d2bbff]">
              {activeTag ?? activeFilter}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <InteractiveButton
                key={tag.label}
                type="button"
                actionId={`explore-tag-${tag.label}`}
                sourcePage="explore"
                onClick={() => {
                  setActiveTag((current) =>
                    current === tag.label ? null : tag.label,
                  );
                }}
                className={`rounded-lg border bg-[#201e2c] px-3 py-1.5 text-xs transition-colors hover:bg-[#2b2836] md:text-sm ${
                  activeTag === tag.label
                    ? "border-[#d2bbff]/50 ring-1 ring-[#d2bbff]/30"
                    : "border-[#363342]"
                } ${tag.color}`}
              >
                {tag.label}
              </InteractiveButton>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
