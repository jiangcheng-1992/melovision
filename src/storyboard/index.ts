import { ContinuityEngine } from "@/storyboard/continuityEngine";
import { LyricsSegmenter } from "@/storyboard/lyricsSegmenter";
import { PromptBuilder } from "@/storyboard/promptBuilder";
import { StoryboardPlanner } from "@/storyboard/storyboardPlanner";
import type { GenerateStoryboardInput, StoryboardOutput } from "@/storyboard/types";

export * from "@/storyboard/types";
export * from "@/storyboard/lyricsSegmenter";
export * from "@/storyboard/continuityEngine";
export * from "@/storyboard/storyboardPlanner";
export * from "@/storyboard/promptBuilder";
export * from "@/storyboard/qualityGuard";

/**
 * 按“两阶段生成”完成完整分镜数据：
 * 1. 先切歌词并产出 storyboard_plan
 * 2. 再基于 plan 生成 cover/video prompts
 */
export async function generateStoryboard(
  input: GenerateStoryboardInput,
): Promise<StoryboardOutput> {
  const segmenter = new LyricsSegmenter(input.segmenterOptions);
  const continuityEngine = new ContinuityEngine({
    characterAnchor: input.characterAnchor,
    worldAnchor: input.worldAnchor,
  });
  const planner = new StoryboardPlanner(input.llm);
  const promptBuilder = new PromptBuilder();

  const segments = segmenter.segment(input.lyrics);
  const plans = await planner.planStoryboard({
    project: input.project,
    segments,
    continuityEngine,
  });

  const scenes = plans.map((plan, index) => ({
    segment: segments[index],
    plan,
    prompts: promptBuilder.buildScenePrompts({
      project: input.project,
      plan,
      characterAnchor: input.characterAnchor,
      worldAnchor: input.worldAnchor,
    }),
  }));

  return {
    project: input.project,
    characterAnchor: continuityEngine.getCharacterAnchor(),
    worldAnchor: continuityEngine.getWorldAnchor(),
    segments,
    scenes,
  };
}
