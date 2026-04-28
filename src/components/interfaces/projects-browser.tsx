"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Clock3,
  Grid2x2,
  List,
  MoreVertical,
  Pencil,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { InteractiveButton } from "@/components/debug/interactive-button";

type ProjectItem = {
  id: string;
  title: string;
  time: string;
  status: string;
  tags?: string[];
  likes?: string;
  plays?: string;
  progress?: number;
  image?: string;
  type: "complete" | "generating" | "draft" | "failed";
  resumeUrl?: string;
};

const PROJECT_SORT_OPTIONS = ["最近更新", "最多点赞", "最多播放"] as const;
const DEFAULT_PROJECT_TAB = "全部";
const DEFAULT_PROJECT_STYLE = "全部风格";
const DEFAULT_PROJECT_SORT = "最近更新";
const DEFAULT_PROJECT_VIEW = "grid" as const;

function parseMetric(value?: string) {
  if (!value) return 0;
  if (value.endsWith("K")) return Number.parseFloat(value) * 1000;
  return Number.parseFloat(value);
}

function StatusBadge({ type, status }: { type: string; status: string }) {
  if (type === "complete") {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-white/5 bg-[#201e2c]/80 px-2.5 py-1 backdrop-blur-md">
        <span className="text-[10px] text-[#4cd7f6]">✅ {status}</span>
      </div>
    );
  }

  if (type === "generating") {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-white/5 bg-[#201e2c]/80 px-2.5 py-1 backdrop-blur-md">
        <RefreshCw className="h-3 w-3 animate-spin text-[#d2bbff]" />
        <span className="text-[10px] text-[#d2bbff]">{status}</span>
      </div>
    );
  }

  if (type === "failed") {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-[#ffb4ab]/20 bg-[#93000a]/10 px-2.5 py-1 backdrop-blur-md">
        <span className="text-[10px] text-[#ffb4ab]">❌ {status}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-white/5 bg-[#201e2c]/80 px-2.5 py-1 backdrop-blur-md">
      <span className="text-[10px] text-[#ccc3d8]">📝 {status}</span>
    </div>
  );
}

export function ProjectsBrowser({
  projects,
  tabs,
}: {
  projects: ProjectItem[];
  tabs: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(DEFAULT_PROJECT_TAB);
  const [styleFilter, setStyleFilter] = useState(DEFAULT_PROJECT_STYLE);
  const [sortBy, setSortBy] = useState(DEFAULT_PROJECT_SORT);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const styleOptions = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach((project) => {
      project.tags?.forEach((tag) => tags.add(tag));
    });
    return [DEFAULT_PROJECT_STYLE, ...Array.from(tags)];
  }, [projects]);

  useEffect(() => {
    const nextQuery = searchParams.get("q") ?? "";
    const nextTab = tabs.includes(searchParams.get("tab") ?? "")
      ? (searchParams.get("tab") as string)
      : DEFAULT_PROJECT_TAB;
    const nextStyle = styleOptions.includes(searchParams.get("style") ?? "")
      ? (searchParams.get("style") as string)
      : DEFAULT_PROJECT_STYLE;
    const nextSort = PROJECT_SORT_OPTIONS.includes(
      (searchParams.get("sort") ??
        DEFAULT_PROJECT_SORT) as (typeof PROJECT_SORT_OPTIONS)[number],
    )
      ? ((searchParams.get("sort") ?? DEFAULT_PROJECT_SORT) as string)
      : DEFAULT_PROJECT_SORT;
    const nextView =
      searchParams.get("view") === "list" ? "list" : DEFAULT_PROJECT_VIEW;

    if (query !== nextQuery) setQuery(nextQuery);
    if (activeTab !== nextTab) setActiveTab(nextTab);
    if (styleFilter !== nextStyle) setStyleFilter(nextStyle);
    if (sortBy !== nextSort) setSortBy(nextSort);
    if (viewMode !== nextView) setViewMode(nextView);
  }, [
    activeTab,
    query,
    searchParams,
    sortBy,
    styleFilter,
    styleOptions,
    tabs,
    viewMode,
  ]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (query.trim()) nextParams.set("q", query.trim());
    else nextParams.delete("q");

    if (activeTab !== DEFAULT_PROJECT_TAB) nextParams.set("tab", activeTab);
    else nextParams.delete("tab");

    if (styleFilter !== DEFAULT_PROJECT_STYLE) nextParams.set("style", styleFilter);
    else nextParams.delete("style");

    if (sortBy !== DEFAULT_PROJECT_SORT) nextParams.set("sort", sortBy);
    else nextParams.delete("sort");

    if (viewMode !== DEFAULT_PROJECT_VIEW) nextParams.set("view", viewMode);
    else nextParams.delete("view");

    const nextQueryString = nextParams.toString();
    const currentQueryString = searchParams.toString();

    if (nextQueryString !== currentQueryString) {
      router.replace(
        nextQueryString ? `${pathname}?${nextQueryString}` : pathname,
        { scroll: false },
      );
    }
  }, [
    activeTab,
    pathname,
    query,
    router,
    searchParams,
    sortBy,
    styleFilter,
    viewMode,
  ]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const tabTypeMap: Record<string, ProjectItem["type"] | null> = {
      全部: null,
      草稿: "draft",
      生成中: "generating",
      已完成: "complete",
      失败: "failed",
    };

    const nextProjects = projects.filter((project) => {
      if (tabTypeMap[activeTab] && project.type !== tabTypeMap[activeTab]) {
        return false;
      }

      if (
        styleFilter !== "全部风格" &&
        !project.tags?.some((tag) => tag === styleFilter)
      ) {
        return false;
      }

      if (!normalizedQuery) return true;

      const searchableText = [
        project.title,
        project.status,
        project.time,
        ...(project.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });

    nextProjects.sort((left, right) => {
      if (sortBy === "最多点赞") {
        return parseMetric(right.likes) - parseMetric(left.likes);
      }

      if (sortBy === "最多播放") {
        return parseMetric(right.plays) - parseMetric(left.plays);
      }

      const order = ["generating", "complete", "draft", "failed"];
      return order.indexOf(left.type) - order.indexOf(right.type);
    });

    return nextProjects;
  }, [activeTab, projects, query, sortBy, styleFilter]);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-[#1c1a27] p-4">
        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#958da1]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-lg bg-[#0e0c19] py-2 pr-4 pl-10 text-sm text-[#e5e0f3] shadow-[inset_0_0_10px_rgba(124,58,237,0.05)] outline-none placeholder:text-[#ccc3d8] focus:ring-1 focus:ring-[#d2bbff]/50"
              placeholder="搜索项目..."
              type="text"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto rounded-lg bg-[#0e0c19] p-1">
            {tabs.map((tab) => (
              <InteractiveButton
                key={tab}
                type="button"
                actionId={`projects-tab-${tab}`}
                sourcePage="projects"
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-[#363342] text-[#e5e0f3]"
                    : "text-[#ccc3d8] hover:text-[#e5e0f3]"
                }`}
              >
                {tab}
              </InteractiveButton>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-[#4a4455]/20 bg-[#0e0c19] px-3 py-2 text-sm text-[#ccc3d8] transition-colors hover:border-[#d2bbff]/50">
            <SlidersHorizontal className="h-[18px] w-[18px]" />
            <select
              value={styleFilter}
              onChange={(event) => setStyleFilter(event.target.value)}
              className="bg-transparent text-sm text-[#ccc3d8] outline-none"
            >
              {styleOptions.map((option) => (
                <option key={option} value={option} className="bg-[#0e0c19]">
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 rounded-lg border border-[#4a4455]/20 bg-[#0e0c19] px-3 py-2 text-sm text-[#ccc3d8] transition-colors hover:border-[#d2bbff]/50">
            <Clock3 className="h-[18px] w-[18px]" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="bg-transparent text-sm text-[#ccc3d8] outline-none"
            >
              {["最近更新", "最多点赞", "最多播放"].map((option) => (
                <option key={option} value={option} className="bg-[#0e0c19]">
                  {option}
                </option>
              ))}
            </select>
          </label>

          <div className="flex rounded-lg border border-[#4a4455]/20 bg-[#0e0c19] p-1">
            <InteractiveButton
              type="button"
              actionId="projects-view-grid"
              sourcePage="projects"
              onClick={() => setViewMode("grid")}
              className={`rounded-md p-1 transition-colors ${
                viewMode === "grid"
                  ? "bg-[#363342] text-[#d2bbff]"
                  : "text-[#ccc3d8] hover:text-[#e5e0f3]"
              }`}
            >
              <Grid2x2 className="h-5 w-5" />
            </InteractiveButton>
            <InteractiveButton
              type="button"
              actionId="projects-view-list"
              sourcePage="projects"
              onClick={() => setViewMode("list")}
              className={`rounded-md p-1 transition-colors ${
                viewMode === "list"
                  ? "bg-[#363342] text-[#d2bbff]"
                  : "text-[#ccc3d8] hover:text-[#e5e0f3]"
              }`}
            >
              <List className="h-5 w-5" />
            </InteractiveButton>
          </div>
        </div>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
            : "grid grid-cols-1 gap-6"
        }
      >
        {filteredProjects.map((project) => {
          const cardBaseClass =
            viewMode === "grid"
              ? "group relative overflow-hidden rounded-2xl bg-[#201e2c] transition-all duration-300 hover:bg-[#2b2836]"
              : "group relative overflow-hidden rounded-2xl bg-[#201e2c] transition-all duration-300 hover:bg-[#2b2836] md:flex";

          if (project.type === "complete") {
            return (
              <Link
                key={project.id}
                href={project.resumeUrl || `/interfaces/export?projectId=${project.id}`}
                className={`${cardBaseClass} hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(210,187,255,0.1)]`}
              >
                <div className={`relative overflow-hidden bg-[#0e0c19] ${viewMode === "grid" ? "aspect-video" : "aspect-video md:w-[360px] md:shrink-0"}`}>
                  <img
                    alt={project.title}
                    className="h-full w-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                    src={project.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14121f]/90 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge type={project.type} status={project.status} />
                  </div>
                  <span className="absolute top-3 right-3 rounded-full bg-black/20 p-1 text-white/50 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="mb-1 truncate text-lg font-medium text-[#e5e0f3]">
                    {project.title}
                  </h3>
                  <p className="mb-3 flex items-center gap-1 text-xs text-[#ccc3d8]">
                    <Clock3 className="h-[14px] w-[14px]" />
                    {project.time}
                  </p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-medium text-[#e5e0f3] backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3 text-xs text-[#e5e0f3]/80">
                    <span>❤️ {project.likes}</span>
                    <span>▶️ {project.plays}</span>
                  </div>
                </div>
              </Link>
            );
          }

          if (project.type === "generating") {
            return (
              <Link
                key={project.id}
                href={project.resumeUrl || `/interfaces/generation?projectId=${project.id}`}
                className={cardBaseClass}
              >
                <div className={`relative overflow-hidden bg-[#0e0c19] ${viewMode === "grid" ? "aspect-video" : "aspect-video md:w-[360px] md:shrink-0"}`}>
                  <img
                    alt={project.title}
                    className="h-full w-full object-cover opacity-30 blur-sm"
                    src={project.image}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#14121f]/40 backdrop-blur-[2px]">
                    <div className="font-display mb-2 text-2xl font-bold text-[#4cd7f6]">
                      {project.progress}%
                    </div>
                    <div className="h-1 w-1/2 overflow-hidden rounded-full bg-[#363342]">
                      <div
                        className="relative h-full bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6]"
                        style={{ width: `${project.progress}%` }}
                      >
                        <div className="absolute inset-0 animate-pulse bg-white/20" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute top-3 left-3">
                    <StatusBadge type={project.type} status={project.status} />
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="mb-1 truncate text-lg font-medium text-[#e5e0f3]">
                    {project.title}
                  </h3>
                  <p className="mb-3 flex items-center gap-1 text-xs text-[#ccc3d8]">
                    <Clock3 className="h-[14px] w-[14px]" />
                    {project.time}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-medium text-[#e5e0f3] backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          }

          if (project.type === "draft") {
            return (
              <Link
                key={project.id}
                href={project.resumeUrl || `/interfaces/create?projectId=${project.id}`}
                className={`${cardBaseClass} border border-dashed border-[#4a4455]/30`}
              >
                <div className={`relative flex items-center justify-center overflow-hidden bg-[#0e0c19] transition-colors group-hover:bg-[#1c1a27] ${viewMode === "grid" ? "aspect-video" : "aspect-video md:w-[360px] md:shrink-0"}`}>
                  <Pencil className="h-10 w-10 text-[#ccc3d8] opacity-50" />
                  <div className="absolute top-3 left-3">
                    <StatusBadge type={project.type} status={project.status} />
                  </div>
                </div>
                <div className="flex-1 p-4">
                  <h3 className="mb-1 truncate text-lg font-medium text-[#ccc3d8] transition-colors group-hover:text-[#e5e0f3]">
                    {project.title}
                  </h3>
                  <p className="flex items-center gap-1 text-xs text-[#ccc3d8]">
                    <Clock3 className="h-[14px] w-[14px]" />
                    {project.time}
                  </p>
                </div>
              </Link>
            );
          }

          return (
            <div
              key={project.id}
              className={cardBaseClass}
            >
              <div className={`relative flex flex-col items-center justify-center border-b border-[#ffb4ab]/10 bg-[#ffb4ab]/5 ${viewMode === "grid" ? "aspect-video" : "aspect-video md:w-[360px] md:shrink-0"}`}>
                <TriangleAlert className="mb-2 h-8 w-8 text-[#ffb4ab]" />
                <span className="text-sm text-[#ffb4ab]/80">渲染引擎错误</span>
                <div className="absolute top-3 left-3">
                  <StatusBadge type={project.type} status={project.status} />
                </div>
                <Link
                  href={project.resumeUrl || `/interfaces/generation?projectId=${project.id}`}
                  className="absolute right-3 bottom-3 flex items-center gap-1 rounded border border-white/10 bg-[#2b2836] px-3 py-1 text-xs text-[#e5e0f3] transition-colors hover:bg-[#363342]"
                >
                  <RefreshCw className="h-[14px] w-[14px]" />
                  重试
                </Link>
              </div>
              <div className="flex-1 p-4">
                <h3 className="mb-1 truncate text-lg font-medium text-[#e5e0f3]">
                  {project.title}
                </h3>
                <p className="flex items-center gap-1 text-xs text-[#ccc3d8]">
                  <Clock3 className="h-[14px] w-[14px]" />
                  {project.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
