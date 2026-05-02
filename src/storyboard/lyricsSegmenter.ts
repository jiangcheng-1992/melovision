import type { LyricsSegment, SegmenterOptions, TimedLyricLine } from "@/storyboard/types";

const DEFAULT_MAX_SCENE_DURATION_SEC = 10;
const DEFAULT_MIN_SCENE_DURATION_SEC = 3;
const DEFAULT_MAX_CHARS_PER_SEGMENT = 18;
const DEFAULT_MAX_LINES_PER_SEGMENT = 2;
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
  private readonly maxCharsPerSegment: number;
  private readonly maxLinesPerSegment: number;
  private readonly sceneChangeKeywords: string[];

  constructor(options: SegmenterOptions = {}) {
    this.maxSceneDurationSec = options.maxSceneDurationSec ?? DEFAULT_MAX_SCENE_DURATION_SEC;
    this.minSceneDurationSec = options.minSceneDurationSec ?? DEFAULT_MIN_SCENE_DURATION_SEC;
    this.maxCharsPerSegment = options.maxCharsPerSegment ?? DEFAULT_MAX_CHARS_PER_SEGMENT;
    this.maxLinesPerSegment = options.maxLinesPerSegment ?? DEFAULT_MAX_LINES_PER_SEGMENT;
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
      return this.splitLongTextLine(line);
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
    }).flatMap((part) => this.splitLongTextLine(part));
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
      const nextText = [...current.map((item) => item.text), line.text].join(" / ");
      const shouldBreak =
        nextDuration > this.maxSceneDurationSec ||
        current.length >= this.maxLinesPerSegment ||
        measureDisplayLength(nextText) > this.maxCharsPerSegment ||
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
      subtitleText: buildSubtitleText(text),
      semanticFocus: extractSemanticFocus(text),
      charCount: measureDisplayLength(text),
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

  private splitLongTextLine(line: {
    id: string;
    text: string;
    startSec: number;
    endSec: number;
    durationSec: number;
  }) {
    if (measureDisplayLength(line.text) <= this.maxCharsPerSegment) {
      return [line];
    }

    const clauses = splitTextIntoClauses(line.text);
    if (clauses.length > 1) {
      return splitLineByClauses(line, clauses, this.maxCharsPerSegment);
    }

    return splitByTextLength(line, this.maxCharsPerSegment);
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

function splitLineByClauses(
  line: {
    id: string;
    text: string;
    startSec: number;
    endSec: number;
    durationSec: number;
  },
  clauses: string[],
  maxCharsPerSegment: number,
) {
  const groups: string[] = [];
  let current = "";

  for (const clause of clauses) {
    const candidate = current ? `${current} / ${clause}` : clause;
    if (current && measureDisplayLength(candidate) > maxCharsPerSegment) {
      groups.push(current);
      current = clause;
    } else {
      current = candidate;
    }
  }

  if (current) {
    groups.push(current);
  }

  if (groups.length <= 1) {
    return splitByTextLength(line, maxCharsPerSegment);
  }

  const weights = groups.map((group) => Math.max(1, measureDisplayLength(group)));
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  let cursor = line.startSec;

  return groups.map((group, index) => {
    const rawDuration = (line.durationSec * weights[index]) / totalWeight;
    const remaining = line.endSec - cursor;
    const isLast = index === groups.length - 1;
    const durationSec = isLast ? remaining : Math.min(remaining, Math.max(0.5, rawDuration));
    const startSec = cursor;
    const endSec = isLast ? line.endSec : roundToMillis(cursor + durationSec);
    cursor = endSec;

    return {
      id: `${line.id}-text-${index + 1}`,
      text: group,
      startSec,
      endSec,
      durationSec: roundToMillis(endSec - startSec),
    };
  });
}

function splitByTextLength(
  line: {
    id: string;
    text: string;
    startSec: number;
    endSec: number;
    durationSec: number;
  },
  maxCharsPerSegment: number,
) {
  const safeText = line.text.trim();
  const pieceCount = Math.max(2, Math.ceil(measureDisplayLength(safeText) / maxCharsPerSegment));
  const chunks = splitTextByLength(safeText, pieceCount);
  const chunkDuration = line.durationSec / chunks.length;

  return chunks.map((chunk, index) => {
    const startSec = roundToMillis(line.startSec + index * chunkDuration);
    const endSec = index === chunks.length - 1 ? line.endSec : roundToMillis(startSec + chunkDuration);

    return {
      id: `${line.id}-chunk-${index + 1}`,
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
  let cursor = 0;

  while (cursor < safeText.length) {
    const remainingText = safeText.slice(cursor);
    if (remainingText.length <= size) {
      chunks.push(remainingText.trim());
      break;
    }

    const minEnd = Math.min(safeText.length, cursor + Math.max(2, Math.floor(size * 0.6)));
    const idealEnd = Math.min(safeText.length, cursor + size);
    const maxEnd = Math.min(safeText.length, cursor + Math.max(size + 3, Math.ceil(size * 1.4)));
    const splitIndex = findNaturalSplitIndex(safeText, cursor, minEnd, idealEnd, maxEnd);
    const nextChunk = safeText.slice(cursor, splitIndex).trim();

    if (!nextChunk) {
      chunks.push(remainingText.trim());
      break;
    }

    chunks.push(nextChunk);
    cursor = splitIndex;
  }

  return chunks;
}

function measureClauseWeight(clause: string) {
  return Math.max(1, clause.replace(/\s+/g, "").length);
}

function measureDisplayLength(text: string) {
  return text.replace(/\s*\/\s*/g, "").replace(/\s+/g, "").length;
}

function buildSubtitleText(text: string) {
  return text.replace(/\s*\/\s*/g, " ").replace(/\s+/g, " ").trim();
}

function extractSemanticFocus(text: string) {
  const [firstClause] = text.split("/").map((item) => item.trim()).filter(Boolean);
  return firstClause || text.trim();
}

function findNaturalSplitIndex(
  text: string,
  start: number,
  minEnd: number,
  idealEnd: number,
  maxEnd: number,
) {
  const candidates = collectSplitCandidates(text, start, minEnd, maxEnd);
  if (candidates.length === 0) {
    return idealEnd;
  }

  candidates.sort((left, right) => {
    const leftDistance = Math.abs(left.index - idealEnd);
    const rightDistance = Math.abs(right.index - idealEnd);

    if (left.score !== right.score) {
      return right.score - left.score;
    }

    if (leftDistance !== rightDistance) {
      return leftDistance - rightDistance;
    }

    return left.index - right.index;
  });

  return candidates[0].index;
}

function collectSplitCandidates(text: string, start: number, minEnd: number, maxEnd: number) {
  const candidates: Array<{ index: number; score: number }> = [];

  for (let index = minEnd; index <= maxEnd; index += 1) {
    if (index <= start || index >= text.length) {
      continue;
    }

    const leftChar = text[index - 1];
    const rightChar = text[index];
    let score = 0;

    if (/\s/.test(leftChar) || /\s/.test(rightChar)) {
      score = 10;
    } else if (/[，。,．.!！?？；;：:、/]/.test(leftChar)) {
      score = 9;
    } else if (isPreferredChineseBoundary(leftChar, rightChar)) {
      score = 7;
    } else if (!isCjk(leftChar) || !isCjk(rightChar)) {
      score = 5;
    }

    if (score > 0) {
      candidates.push({ index: normalizeSplitIndex(text, index), score });
    }
  }

  return dedupeCandidates(candidates);
}

function dedupeCandidates(candidates: Array<{ index: number; score: number }>) {
  const scoreByIndex = new Map<number, number>();

  for (const candidate of candidates) {
    const previous = scoreByIndex.get(candidate.index) ?? 0;
    if (candidate.score > previous) {
      scoreByIndex.set(candidate.index, candidate.score);
    }
  }

  return Array.from(scoreByIndex.entries()).map(([index, score]) => ({ index, score }));
}

function normalizeSplitIndex(text: string, index: number) {
  let next = index;

  while (next < text.length && /\s/.test(text[next])) {
    next += 1;
  }

  return next;
}

function isPreferredChineseBoundary(leftChar: string, rightChar: string) {
  const boundaryAfter = "了啊呀吧呢吗着过后前中里外上下来去";
  const boundaryBefore = "我你他她它又还再把向跟和与但却仍就让被从到在往";
  return boundaryAfter.includes(leftChar) || boundaryBefore.includes(rightChar);
}

function isCjk(char: string) {
  return /[\u4e00-\u9fff]/.test(char);
}

function roundToMillis(value: number) {
  return Math.round(value * 1000) / 1000;
}
