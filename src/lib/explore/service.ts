import { prisma } from "@/lib/prisma";
import { extractStoryboardVideoPrompt } from "@/lib/mv/storyboard-prompt-package";

const ACCENT_CLASSES = [
  "text-[#4cd7f6] border-[#4cd7f6]/30",
  "text-[#d2bbff] border-[#d2bbff]/30",
  "text-[#ffb690] border-[#ffb690]/30",
  "text-[#ccc3d8] border-[#ccc3d8]/30",
] as const;

const TAG_COLORS = [
  "text-[#4cd7f6]",
  "text-[#d2bbff]",
  "text-[#ffb690]",
  "text-[#ccc3d8]",
] as const;

function formatDuration(totalSec: number) {
  const minutes = Math.floor(totalSec / 60);
  const seconds = `${totalSec % 60}`.padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function formatCompactMetric(value: number) {
  if (value >= 10000) {
    const formatted = (value / 1000).toFixed(0);
    return `${formatted}K`;
  }

  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1).replace(/\.0$/, "");
    return `${formatted}K`;
  }

  return `${value}`;
}

function splitTags(value?: string | null) {
  if (!value) {
    return [];
  }

  return value
    .split(/[,\n|/]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeTag(value?: string | null) {
  return value?.trim() || "未分类";
}

function buildEmptyExploreFeed() {
  return {
    filters: ["全部"],
    cards: [],
    hero: null,
    leaderboard: [],
    trendingTags: [],
    total: 0,
  };
}

function logExploreError(scope: string, error: unknown) {
  console.error(`[explore] ${scope}`, error);
}

export async function getExploreFeed() {
  try {
    const projects = await prisma.mvProject.findMany({
      where: {
        published: true,
        status: "completed",
      },
      include: {
        user: true,
        musicOptions: true,
        scenes: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: [{ playCount: "desc" }, { updatedAt: "desc" }],
      take: 36,
    });

    const cards = projects.map((project, index) => {
      const selectedMusic =
        project.musicOptions.find((item) => item.id === project.selectedMusicOptionId) ??
        project.musicOptions.find((item) => item.isSelected) ??
        project.musicOptions[0] ??
        null;

      const tags = Array.from(
        new Set([
          normalizeTag(project.musicStyle),
          normalizeTag(project.visualStyle),
          normalizeTag(selectedMusic?.genre),
          ...splitTags(selectedMusic?.tags).slice(0, 3),
        ]),
      ).filter(Boolean);

      return {
        id: project.id,
        href: `/interfaces/explore/${project.id}`,
        title: project.title,
        creator: project.user.displayName,
        creatorInitial: project.user.displayName.slice(0, 1).toUpperCase(),
        creatorAvatar: "",
        tag: tags[0] ?? "未分类",
        tags,
        duration: formatDuration(selectedMusic?.durationSec ?? 0),
        likes: formatCompactMetric(project.likeCount),
        plays: formatCompactMetric(project.playCount),
        likeCount: project.likeCount,
        playCount: project.playCount,
        image:
          project.coverImageUrl ??
          selectedMusic?.artworkUrl ??
          project.scenes[0]?.previewImageUrl ??
          "",
        accent: ACCENT_CLASSES[index % ACCENT_CLASSES.length],
        summary: project.conceptPrompt.slice(0, 120),
        updatedAt: project.updatedAt.toISOString(),
      };
    });

    const hero = cards[0] ?? null;

    const tagCounts = new Map<string, number>();
    cards.forEach((card) => {
      card.tags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
      });
    });

    const dynamicFilters = Array.from(tagCounts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 6)
      .map(([tag]) => tag);

    const trendingTags = Array.from(tagCounts.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8)
      .map(([label], index) => ({
        label,
        color: TAG_COLORS[index % TAG_COLORS.length],
      }));

    const leaderboardSource = await prisma.user.findMany({
      where: {
        projects: {
          some: {
            published: true,
            status: "completed",
          },
        },
      },
      include: {
        _count: {
          select: {
            projects: {
              where: {
                published: true,
                status: "completed",
              },
            },
          },
        },
      },
      take: 8,
    });

    const leaderboard = leaderboardSource
      .sort((left, right) => right._count.projects - left._count.projects)
      .slice(0, 4)
      .map((user, index) => ({
        rank: `${index + 1}`,
        name: user.displayName,
        count: `${user._count.projects} MV 作品`,
        color: TAG_COLORS[index % TAG_COLORS.length],
        image: "",
      }));

    return {
      filters: ["全部", "热门 🔥", "最新", "最多点赞", ...dynamicFilters],
      cards,
      hero,
      leaderboard,
      trendingTags,
      total: cards.length,
    };
  } catch (error) {
    logExploreError("getExploreFeed", error);
    return buildEmptyExploreFeed();
  }
}

async function findPublicProject(projectId: string) {
  return prisma.mvProject.findFirst({
    where: {
      id: projectId,
      published: true,
      status: "completed",
    },
    include: {
      user: true,
      musicOptions: true,
      scenes: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

function buildPublicProjectDetail(
  project: NonNullable<Awaited<ReturnType<typeof findPublicProject>>>,
  playCount: number,
) {
  const selectedMusic =
    project.musicOptions.find((item) => item.id === project.selectedMusicOptionId) ??
    project.musicOptions.find((item) => item.isSelected) ??
    project.musicOptions[0] ??
    null;

  const tags = Array.from(
    new Set([
      normalizeTag(project.musicStyle),
      normalizeTag(project.visualStyle),
      normalizeTag(selectedMusic?.genre),
      ...splitTags(selectedMusic?.tags).slice(0, 4),
    ]),
  ).filter(Boolean);

  return {
    id: project.id,
    title: project.title,
    creator: project.user.displayName,
    creatorInitial: project.user.displayName.slice(0, 1).toUpperCase(),
    conceptPrompt: project.conceptPrompt,
    customLyrics: project.customLyrics,
    coverImageUrl:
      project.coverImageUrl ??
      selectedMusic?.artworkUrl ??
      project.scenes[0]?.previewImageUrl ??
      "",
    musicStyle: project.musicStyle,
    visualStyle: project.visualStyle,
    duration: formatDuration(selectedMusic?.durationSec ?? 0),
    likes: formatCompactMetric(project.likeCount),
    plays: formatCompactMetric(playCount),
    tags,
    scenes: project.scenes.map((scene) => ({
      id: scene.id,
      sortOrder: scene.sortOrder,
      startSec: scene.startSec,
      endSec: scene.endSec,
      lyricLine: scene.lyricLine,
      prompt: extractStoryboardVideoPrompt(scene.prompt),
      previewImageUrl: scene.previewImageUrl ?? "",
    })),
    music: selectedMusic
      ? {
          title: selectedMusic.title,
          genre: selectedMusic.genre,
          bpm: selectedMusic.bpm,
          lyricSnippet: selectedMusic.lyricSnippet,
          tags: splitTags(selectedMusic.tags),
        }
      : null,
    updatedAt: project.updatedAt.toISOString(),
  };
}

export async function getPublicProjectDetail(projectId: string) {
  try {
    const project = await findPublicProject(projectId);

    if (!project) {
      return null;
    }

    return buildPublicProjectDetail(project, project.playCount);
  } catch (error) {
    logExploreError("getPublicProjectDetail", error);
    return null;
  }
}

export async function getPublicProjectDetailAndTrackPlay(projectId: string) {
  try {
    const project = await findPublicProject(projectId);

    if (!project) {
      return null;
    }

    await prisma.mvProject.update({
      where: { id: projectId },
      data: {
        playCount: {
          increment: 1,
        },
      },
    });

    return buildPublicProjectDetail(project, project.playCount + 1);
  } catch (error) {
    logExploreError("getPublicProjectDetailAndTrackPlay", error);
    return null;
  }
}
