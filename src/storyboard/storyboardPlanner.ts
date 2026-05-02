import { z } from "zod";

import { ContinuityEngine } from "@/storyboard/continuityEngine";
import type {
  GenerateStoryboardInput,
  LyricsSegment,
  StoryboardPlan,
} from "@/storyboard/types";

export const STORYBOARD_PLANNER_SYSTEM_PROMPT = `你是 MeloVision 的分镜规划导演。
你的任务是只输出 storyboard_plan，不输出 cover prompt，不输出 video prompt。

硬性规则：
1. 每个分镜时长不能超过 10 秒。
2. 分镜必须表达歌词的情绪、关系和叙事推进，而不是逐字翻译歌词。
3. 若歌词没有明确换场信号，不允许突然更换人物、地点或时间线。
4. 除首镜外，每个分镜都要给出 continuity_with_prev。
5. 必须显式继承角色外观、服装、场景、时间、光线、情绪基调中的至少 3 项；若不允许换场，优先继承 4-5 项。
6. video prompt 所需信息必须在 storyboard_plan 里提前确定：动作起点、动作终点、镜头运动。
7. 禁止出现文字水印、多余角色、错位肢体的风险设定。
8. sceneChangeAllowed 为 true 时，必须解释 transitionReason。
9. subtitleText 必须和当前歌词片段一致或高度贴近，适合字幕展示，尽量不超过 18 个中文字符。
10. primaryCharacterId 默认保持与上一镜一致，除非歌词明确出现新人物。
11. allowCharacterChange 为 true 时，必须解释 characterChangeReason。
12. lyricIntent 要写清这一段歌词真正要表达的关系、情绪或叙事推进。`;

const inheritedDimensionSchema = z.enum([
  "character_appearance",
  "wardrobe",
  "setting",
  "time_of_day",
  "lighting",
  "mood_tone",
]);

export const storyboardPlanSchema = z.object({
  subtitleText: z.string().min(1),
  lyricIntent: z.string().min(4),
  narrativePurpose: z.string().min(8),
  emotionalSubtext: z.string().min(4),
  subject: z.string().min(2),
  primaryCharacterId: z.string().min(2),
  visibleCharacterIds: z.array(z.string().min(2)).min(1),
  allowCharacterChange: z.boolean(),
  characterChangeReason: z.string().optional(),
  identityGuard: z.string().min(8),
  subjectState: z.string().min(4),
  actionStart: z.string().min(4),
  actionEnd: z.string().min(4),
  setting: z.string().min(2),
  timeOfDay: z.string().min(2),
  lighting: z.string().min(2),
  moodTone: z.string().min(2),
  shotType: z.string().min(2),
  cameraMovement: z.string().min(2),
  visualFocus: z.string().min(4),
  coverMoment: z.string().min(4),
  continuitySummary: z.string().min(8),
  continuity_with_prev: z.string().optional(),
  sceneChangeAllowed: z.boolean(),
  transitionReason: z.string().optional(),
  inheritedDimensions: z.array(inheritedDimensionSchema).min(3),
  continuityChecklist: z.array(z.string().min(4)).min(3),
});

/**
 * 只负责把“歌词片段 + 连续性上下文”变成可执行的分镜规划数据。
 * Prompt 生成在下一层单独完成，保证两阶段可独立重跑。
 */
export class StoryboardPlanner {
  constructor(private readonly llm: GenerateStoryboardInput["llm"]) {}

  /**
   * 为整支 MV 生成结构化的 storyboard_plan。
   */
  async planStoryboard(input: {
    project: GenerateStoryboardInput["project"];
    segments: LyricsSegment[];
    continuityEngine: ContinuityEngine;
  }): Promise<StoryboardPlan[]> {
    const plans: StoryboardPlan[] = [];

    for (const segment of input.segments) {
      const previousPlan = plans[plans.length - 1];
      const plan = await this.planSegment({
        project: input.project,
        segment,
        previousPlan,
        continuityEngine: input.continuityEngine,
      });
      plans.push(plan);
      input.continuityEngine.updateAnchors(plan);
    }

    return plans;
  }

  /**
   * 为单个分镜单元生成 storyboard_plan，便于局部重生成。
   */
  async planSegment(input: {
    project: GenerateStoryboardInput["project"];
    segment: LyricsSegment;
    previousPlan?: StoryboardPlan;
    continuityEngine: ContinuityEngine;
  }): Promise<StoryboardPlan> {
    const continuity = input.continuityEngine.buildContext(input.segment, input.previousPlan);

    const userPrompt = buildPlannerUserPrompt({
      project: input.project,
      segment: input.segment,
      continuity,
    });

    const raw = await this.llm.invoke(
      STORYBOARD_PLANNER_SYSTEM_PROMPT,
      userPrompt,
      storyboardPlanSchema,
    );

    const inheritedDimensions = Array.from(new Set(raw.inheritedDimensions));
    const continuityWithPrev =
      input.segment.index === 0
        ? undefined
        : raw.continuity_with_prev ?? continuity.continuityPrefix ?? "承接上一镜的主体状态与情绪余波，顺势推进当前段落。";

    return {
      sceneId: input.segment.id,
      index: input.segment.index,
      lyricText: input.segment.text,
      subtitleText: normalizeSubtitleText(raw.subtitleText, input.segment.subtitleText),
      startSec: input.segment.startSec,
      endSec: input.segment.endSec,
      durationSec: input.segment.durationSec,
      lyricIntent: raw.lyricIntent,
      narrativePurpose: raw.narrativePurpose,
      emotionalSubtext: raw.emotionalSubtext,
      subject: raw.subject,
      primaryCharacterId: raw.primaryCharacterId || continuity.primaryCharacterId,
      visibleCharacterIds: Array.from(
        new Set(raw.visibleCharacterIds.length > 0 ? raw.visibleCharacterIds : continuity.mustKeepCharacterIds),
      ),
      allowCharacterChange: raw.allowCharacterChange && continuity.allowCharacterChange,
      characterChangeReason:
        raw.characterChangeReason ??
        (continuity.allowCharacterChange ? continuity.characterChangeReason : undefined),
      identityGuard: raw.identityGuard,
      subjectState: raw.subjectState,
      actionStart: raw.actionStart,
      actionEnd: raw.actionEnd,
      setting: raw.setting,
      timeOfDay: raw.timeOfDay,
      lighting: raw.lighting,
      moodTone: raw.moodTone,
      shotType: raw.shotType,
      cameraMovement: raw.cameraMovement,
      visualFocus: raw.visualFocus,
      coverMoment: raw.coverMoment,
      continuitySummary: raw.continuitySummary,
      continuity_with_prev: continuityWithPrev,
      sceneChangeAllowed: raw.sceneChangeAllowed || continuity.allowSceneBreak,
      transitionReason:
        raw.transitionReason ??
        (continuity.allowSceneBreak ? continuity.transitionReason ?? "歌词存在明确换场信号。" : undefined),
      inheritedDimensions,
      continuityChecklist: raw.continuityChecklist,
      continuitySnapshot: continuity.continuitySnapshot,
    };
  }
}

function buildPlannerUserPrompt(input: {
  project: GenerateStoryboardInput["project"];
  segment: LyricsSegment;
  continuity: ReturnType<ContinuityEngine["buildContext"]>;
}) {
  return `项目标题：${input.project.title}
MV 概念：${input.project.concept}
视觉风格：${input.project.visualStyle}
音乐风格：${input.project.musicStyle ?? "未指定"}
画幅比例：${input.project.aspectRatio ?? "16:9"}
歌词语言：${input.project.language ?? "zh-CN"}

当前歌词分镜：
- sceneId: ${input.segment.id}
- index: ${input.segment.index}
- text: ${input.segment.text}
- subtitleText: ${input.segment.subtitleText}
- semanticFocus: ${input.segment.semanticFocus}
- charCount: ${input.segment.charCount}
- startSec: ${input.segment.startSec}
- endSec: ${input.segment.endSec}
- durationSec: ${input.segment.durationSec}

连续性上下文：
${input.continuity.plannerBrief}

输出要求：
- 只返回 schema 对应字段
- narrativePurpose 写“这一镜在叙事上拍什么”
- emotionalSubtext 写“歌词背后的情绪，而不是字面意思”
- lyricIntent 写“这句歌词真正想表达的关系、动作或情绪推进”
- subtitleText 必须适合直接拿来做字幕，尽量精简，优先不超过 18 个中文字符
- primaryCharacterId 默认沿用连续性上下文给出的主角ID
- visibleCharacterIds 至少包含 primaryCharacterId
- allowCharacterChange 只有歌词明确出现新人物时才可为 true
- actionStart / actionEnd 必须明确
- cameraMovement 必须能直接用于视频生成
- continuity_with_prev 首镜可省略，后续镜头必须写
- inheritedDimensions 至少 3 项
- continuityChecklist 至少 3 条，写成可执行的连续性检查点`;
}

function normalizeSubtitleText(value: string, fallback: string) {
  const normalized = value.trim() || fallback.trim();
  return normalized.replace(/\s+/g, " ").slice(0, 24);
}
