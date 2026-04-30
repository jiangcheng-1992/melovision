import type { LyricsSegment, SegmenterOptions, TimedLyricLine } from "@/storyboard/types";

const DEFAULT_MAX_SCENE_DURATION_SEC = 10;
const DEFAULT_MIN_SCENE_DURATION_SEC = 3;
const DEFAULT_SCENE_CHANGE_KEYWORDS = [
  "回到",
  "梦里",
  "梦中",
  "多年后",
  "后来",
  "忽然",
  "突然",
  "醒来",
  "雨停了",
  "天亮了",
  "天黑了",
  "下一站",
  "离开",
  "再见",
];

/**
 * 将歌词按“时间约束优先、语义边界其次”的规则切成分镜单元。
 *
 * 算法要点：
 * 1. 先把时长超过 10 秒的单行歌词按标点 / 语义停顿做二次切分。
 * 2. 再把相邻的短句尽量合并，但总时长不能超过 maxSceneDurationSec。
 * 3. 每个片段保留换场信号，供后续连续性引擎决定是否允许打破继承。
 */
export class LyricsSegmenter {
  private readonly maxSceneDurationSec: number;
  private readonly minSceneDurationSec: number;
  private readonly sceneChangeKeywords: string[];

  constructor(options: SegmenterOptions = {}) {
    this.maxSceneDurationSec = options.maxSceneDurationSec ?? DEFAULT_MAX_SCENE_DURATION_SEC;
    this.minSceneDurationSec = options.minSceneDurationSec ?? DEFAULT_MIN_SCENE_DURATION_SEC;
    this.sceneChangeKeywords = options.sceneChangeKeywords ?? DEFAULT_SCENE_CHANGE_KEYWORDS;
  }

  /**
   * 根据带时间轴的歌词生成分镜切片。
   */
  segment(lines: TimedLyricLine[]): LyricsSegment[] {
    const normalized = lines
      .map((line, index) => this.normalizeLine(line, index))
      .flatMap((line) => this.splitOversizedLine(line));

    const packed = this.packNormalizedLines(normalized);
    return packed.map((group, index) => this.toSegment(group, index));
  }

  private normalizeLine(line: TimedLyricLine, index: number) {
    const text = line.text.trim();
    const startSec = Math.max(0, line.startSec);
    const endSec = Math.max(startSec + 0.1, line.endSec);

    return {
      id: line.id ?? `line-${index + 1}`,
      text,
      startSec,
      endSec,
      durationSec: endSec - startSec,
    };
  }

  private splitOversizedLine(line: {
    id: string;
    text: string;
    startSec: number;
    endSec: number;
    durationSec: number;
  }) {
    if (line.durationSec <= this.maxSceneDurationSec) {
      return [line];
    }

    const clauses = splitTextIntoClauses(line.text);
    if (clauses.length <= 1) {
      return splitByDurationOnly(line, this.maxSceneDurationSec);
    }

    const totalWeight = clauses.reduce((sum, clause) => sum + measureClauseWeight(clause), 0);
    let cursor = line.startSec;

    return clauses.map((clause, index) => {
      const rawDuration = (line.durationSec * measureClauseWeight(clause)) / totalWeight;
      const remaining = line.endSec - cursor;
      const isLast = index === clauses.length - 1;
      const durationSec = isLast ? remaining : Math.min(remaining, Math.max(0.5, rawDuration));
      const startSec = cursor;
      const endSec = isLast ? line.endSec : roundToMillis(cursor + durationSec);
      cursor = endSec;

      return {
        id: `${line.id}-part-${index + 1}`,
        text: clause,
        startSec,
        endSec,
        durationSec: endSec - startSec,
      };
    });
  }

  private packNormalizedLines(
    lines: Array<{
      id: string;
      text: string;
      startSec: number;
      endSec: number;
      durationSec: number;
    }>,
  ) {
    const groups: typeof lines[] = [];
    let current: typeof lines = [];

    for (const line of lines) {
      if (current.length === 0) {
        current.push(line);
        continue;
      }

      const currentStart = current[0].startSec;
      const nextDuration = line.endSec - currentStart;
      const shouldBreak =
        nextDuration > this.maxSceneDurationSec ||
        this.hasStrongSceneBreakSignal(line.text) ||
        (current.length > 0 && nextDuration >= this.minSceneDurationSec && this.hasStrongSceneBreakSignal(current[current.length - 1].text));

      if (shouldBreak) {
        groups.push(current);
        current = [line];
      } else {
        current.push(line);
      }
    }

    if (current.length > 0) {
      groups.push(current);
    }

    return groups;
  }

  private toSegment(
    lines: Array<{
      id: string;
      text: string;
      startSec: number;
      endSec: number;
      durationSec: number;
    }>,
    index: number,
  ): LyricsSegment {
    const text = lines.map((line) => line.text).join(" / ");
    const startSec = lines[0].startSec;
    const endSec = lines[lines.length - 1].endSec;

    return {
      id: `scene-${index + 1}`,
      index,
      text,
      startSec,
      endSec,
      durationSec: roundToMillis(endSec - startSec),
      sourceLineIds: lines.map((line) => line.id),
      sceneChangeSignals: this.sceneChangeKeywords.filter((keyword) => text.includes(keyword)),
    };
  }

  private hasStrongSceneBreakSignal(text: string) {
    return this.sceneChangeKeywords.some((keyword) => text.includes(keyword));
  }
}

function splitTextIntoClauses(text: string) {
  return text
    .split(/[，。,．.!！?？；;：:\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function splitByDurationOnly(
  line: {
    id: string;
    text: string;
    startSec: number;
    endSec: number;
    durationSec: number;
  },
  maxDurationSec: number,
) {
  const pieceCount = Math.max(2, Math.ceil(line.durationSec / maxDurationSec));
  const chunks = splitTextByLength(line.text, pieceCount);
  const chunkDuration = line.durationSec / chunks.length;

  return chunks.map((chunk, index) => {
    const startSec = roundToMillis(line.startSec + index * chunkDuration);
    const endSec = index === chunks.length - 1 ? line.endSec : roundToMillis(startSec + chunkDuration);

    return {
      id: `${line.id}-part-${index + 1}`,
      text: chunk,
      startSec,
      endSec,
      durationSec: roundToMillis(endSec - startSec),
    };
  });
}

function splitTextByLength(text: string, pieceCount: number) {
  const safeText = text.trim();
  if (pieceCount <= 1 || safeText.length <= pieceCount) {
    return [safeText];
  }

  const size = Math.ceil(safeText.length / pieceCount);
  const chunks: string[] = [];

  for (let index = 0; index < safeText.length; index += size) {
    chunks.push(safeText.slice(index, index + size));
  }

  return chunks;
}

function measureClauseWeight(clause: string) {
  return Math.max(1, clause.replace(/\s+/g, "").length);
}

function roundToMillis(value: number) {
  return Math.round(value * 1000) / 1000;
}
