import type { infer as Infer, ZodTypeAny } from "zod";

export type InheritedDimension =
  | "character_appearance"
  | "wardrobe"
  | "setting"
  | "time_of_day"
  | "lighting"
  | "mood_tone";

export interface TimedLyricLine {
  id?: string;
  text: string;
  startSec: number;
  endSec: number;
}

export interface StoryboardProjectContext {
  title: string;
  concept: string;
  visualStyle: string;
  musicStyle?: string;
  language?: string;
  aspectRatio?: string;
  globalNegativePrompt?: string;
}

export interface LyricsSegment {
  id: string;
  index: number;
  text: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  sourceLineIds: string[];
  sceneChangeSignals: string[];
}

export interface CharacterAnchor {
  identity: string;
  appearance: string;
  wardrobe: string;
  emotionalBaseline: string;
  nonNegotiables: string[];
}

export interface WorldAnchor {
  setting: string;
  timeOfDay: string;
  lighting: string;
  atmosphere: string;
  continuityRules: string[];
}

export interface ContinuitySnapshot {
  previousSceneId?: string;
  previousSummary?: string;
  subjectState?: string;
  cameraState?: string;
  environmentState?: string;
  emotionState?: string;
}

export interface StoryboardPlan {
  sceneId: string;
  index: number;
  lyricText: string;
  startSec: number;
  endSec: number;
  durationSec: number;
  narrativePurpose: string;
  emotionalSubtext: string;
  subject: string;
  subjectState: string;
  actionStart: string;
  actionEnd: string;
  setting: string;
  timeOfDay: string;
  lighting: string;
  moodTone: string;
  shotType: string;
  cameraMovement: string;
  visualFocus: string;
  coverMoment: string;
  continuitySummary: string;
  continuity_with_prev?: string;
  sceneChangeAllowed: boolean;
  transitionReason?: string;
  inheritedDimensions: InheritedDimension[];
  continuitySnapshot?: ContinuitySnapshot;
}

export interface PromptBundle {
  shared_context: string;
  cover_prompt: string;
  video_prompt: string;
  negative_prompt: string;
}

export interface StoryboardScene {
  segment: LyricsSegment;
  plan: StoryboardPlan;
  prompts: PromptBundle;
}

export interface StoryboardOutput {
  project: StoryboardProjectContext;
  characterAnchor: CharacterAnchor;
  worldAnchor: WorldAnchor;
  segments: LyricsSegment[];
  scenes: StoryboardScene[];
}

export interface SegmenterOptions {
  maxSceneDurationSec?: number;
  minSceneDurationSec?: number;
  sceneChangeKeywords?: string[];
}

export interface GenerateStoryboardInput {
  project: StoryboardProjectContext;
  lyrics: TimedLyricLine[];
  characterAnchor: CharacterAnchor;
  worldAnchor: WorldAnchor;
  llm: LLMClient;
  segmenterOptions?: SegmenterOptions;
}

export interface LLMClient {
  invoke<TSchema extends ZodTypeAny>(
    systemPrompt: string,
    userPrompt: string,
    schema: TSchema,
  ): Promise<Infer<TSchema>>;
}
