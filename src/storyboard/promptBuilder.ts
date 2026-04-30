import type {
  CharacterAnchor,
  PromptBundle,
  StoryboardPlan,
  StoryboardProjectContext,
  WorldAnchor,
} from "@/storyboard/types";

export const COVER_PROMPT_TEMPLATE = `你正在为 AI 音乐 MV 生成分镜封面图。
目标：定格这一镜最能代表情绪与叙事推进的一帧。
必须保留统一角色、服装、场景逻辑，不要重新发明人物设定。`;

export const VIDEO_PROMPT_TEMPLATE = `你正在为 AI 音乐 MV 生成分镜视频 prompt。
目标：描述同一镜头中的动作起点、动作终点与镜头运动，让画面能自然衔接上下镜。`;

export const NEGATIVE_PROMPT_TEMPLATE = `text, typography, subtitles, watermark, logo, extra characters, duplicated people, malformed hands, broken limbs, fused fingers, deformed face, low consistency, sudden costume change, random location change, unrelated props, collage composition`;

/**
 * 基于 storyboard_plan 生成 cover/video/negative prompts。
 * 这一层不重新规划内容，只把规划结果转成稳定 prompt。
 */
export class PromptBuilder {
  /**
   * 为单个分镜构建 prompt。
   */
  buildScenePrompts(input: {
    project: StoryboardProjectContext;
    plan: StoryboardPlan;
    characterAnchor: CharacterAnchor;
    worldAnchor: WorldAnchor;
  }): PromptBundle {
    const sharedContext = buildSharedContext(input);

    const coverPrompt = [
      COVER_PROMPT_TEMPLATE,
      sharedContext,
      `当前镜头封面定格：${input.plan.coverMoment}。`,
      `主体：${input.plan.subject}；状态：${input.plan.subjectState}。`,
      `场景：${input.plan.setting}；时间：${input.plan.timeOfDay}；光线：${input.plan.lighting}。`,
      `情绪基调：${input.plan.moodTone}。`,
      input.plan.continuity_with_prev ? `承接说明：${input.plan.continuity_with_prev}` : null,
      `构图重点：${input.plan.visualFocus}。`,
      `封面必须像电影分镜首帧，不要文字，不要多余角色，不要错位肢体。`,
    ]
      .filter(Boolean)
      .join("\n");

    const videoPrompt = [
      VIDEO_PROMPT_TEMPLATE,
      sharedContext,
      input.plan.continuity_with_prev ? `承接上一镜：${input.plan.continuity_with_prev}` : null,
      `动作起点：${input.plan.actionStart}。`,
      `动作终点：${input.plan.actionEnd}。`,
      `镜头语言：${input.plan.shotType}，镜头运动为 ${input.plan.cameraMovement}。`,
      `这一镜的叙事目的：${input.plan.narrativePurpose}。`,
      `情绪潜台词：${input.plan.emotionalSubtext}。`,
      `主体状态必须从起点自然过渡到终点，不允许突然换人、换衣服、换场景。`,
    ]
      .filter(Boolean)
      .join("\n");

    const negativePrompt = [
      NEGATIVE_PROMPT_TEMPLATE,
      input.project.globalNegativePrompt ?? null,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      shared_context: sharedContext,
      cover_prompt: coverPrompt,
      video_prompt: videoPrompt,
      negative_prompt: negativePrompt,
    };
  }
}

function buildSharedContext(input: {
  project: StoryboardProjectContext;
  plan: StoryboardPlan;
  characterAnchor: CharacterAnchor;
  worldAnchor: WorldAnchor;
}) {
  return `项目：${input.project.title}
整体概念：${input.project.concept}
视觉风格：${input.project.visualStyle}
音乐风格：${input.project.musicStyle ?? "未指定"}
画幅比例：${input.project.aspectRatio ?? "16:9"}
角色锚点：${input.characterAnchor.identity}；外观 ${input.characterAnchor.appearance}；服装 ${input.characterAnchor.wardrobe}
世界锚点：场景 ${input.worldAnchor.setting}；时间 ${input.worldAnchor.timeOfDay}；光线 ${input.worldAnchor.lighting}；氛围 ${input.worldAnchor.atmosphere}
当前歌词：${input.plan.lyricText}
当前镜头摘要：${input.plan.continuitySummary}
连续继承项：${input.plan.inheritedDimensions.join(", ")}
统一主体：${input.plan.subject}
统一情绪：${input.plan.moodTone}`;
}
