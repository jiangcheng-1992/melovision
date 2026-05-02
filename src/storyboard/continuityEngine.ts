import type {
  CharacterAnchor,
  ContinuitySnapshot,
  InheritedDimension,
  LyricsSegment,
  StoryboardPlan,
  WorldAnchor,
} from "@/storyboard/types";

const DEFAULT_TRANSITION_KEYWORDS = [
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
  "离开",
  "下一站",
];

export interface ContinuityContext {
  allowSceneBreak: boolean;
  allowCharacterChange: boolean;
  transitionReason?: string;
  characterChangeReason?: string;
  primaryCharacterId: string;
  mustKeepCharacterIds: string[];
  identityGuard: string;
  continuityChecklist: string[];
  inheritedDimensions: InheritedDimension[];
  continuityPrefix?: string;
  continuitySnapshot?: ContinuitySnapshot;
  plannerBrief: string;
}

/**
 * 连续性引擎负责把“上一镜发生了什么”和“当前镜必须继承什么”压成稳定的规则输入。
 * 它本身不调用 LLM，只生成结构化上下文与自然语言前缀，供规划器 / prompt 构建器复用。
 */
export class ContinuityEngine {
  private characterAnchor: CharacterAnchor;
  private worldAnchor: WorldAnchor;
  private readonly transitionKeywords: string[];

  constructor(input: {
    characterAnchor: CharacterAnchor;
    worldAnchor: WorldAnchor;
    transitionKeywords?: string[];
  }) {
    this.characterAnchor = input.characterAnchor;
    this.worldAnchor = input.worldAnchor;
    this.transitionKeywords = input.transitionKeywords ?? DEFAULT_TRANSITION_KEYWORDS;
  }

  getCharacterAnchor() {
    return this.characterAnchor;
  }

  getWorldAnchor() {
    return this.worldAnchor;
  }

  /**
   * 为当前歌词片段生成承接上下文。
   */
  buildContext(segment: LyricsSegment, previousPlan?: StoryboardPlan): ContinuityContext {
    const allowSceneBreak = this.shouldAllowSceneBreak(segment);
    const primaryCharacterId = toCharacterId(this.characterAnchor.identity);
    const allowCharacterChange = allowSceneBreak && hasExplicitCharacterShiftSignal(segment.text);
    const characterChangeReason = allowCharacterChange
      ? "歌词出现明确的人物切换或新的关系对象。"
      : undefined;
    const transitionReason = allowSceneBreak
      ? `歌词出现换场信号：${segment.sceneChangeSignals.join(" / ")}`
      : undefined;
    const inheritedDimensions = allowSceneBreak ? minimalInheritedDimensions() : defaultInheritedDimensions();
    const continuitySnapshot = previousPlan ? buildSnapshot(previousPlan) : undefined;
    const continuityPrefix =
      previousPlan && !allowSceneBreak
        ? `承接上一镜中${previousPlan.subject}的状态“${previousPlan.subjectState}”，沿用${previousPlan.setting}的空间关系、${previousPlan.cameraMovement}的镜头节奏与${previousPlan.moodTone}的情绪余波。`
        : undefined;
    const continuityChecklist = buildContinuityChecklist({
      allowSceneBreak,
      allowCharacterChange,
      characterAnchor: this.characterAnchor,
      worldAnchor: this.worldAnchor,
      previousPlan,
    });
    const identityGuard = buildIdentityGuard({
      characterAnchor: this.characterAnchor,
      primaryCharacterId,
      allowCharacterChange,
      characterChangeReason,
    });

    const plannerBrief = buildPlannerBrief({
      characterAnchor: this.characterAnchor,
      worldAnchor: this.worldAnchor,
      inheritedDimensions,
      allowSceneBreak,
      allowCharacterChange,
      transitionReason,
      characterChangeReason,
      primaryCharacterId,
      mustKeepCharacterIds: [primaryCharacterId],
      identityGuard,
      continuityChecklist,
      continuitySnapshot,
      continuityPrefix,
    });

    return {
      allowSceneBreak,
      allowCharacterChange,
      transitionReason,
      characterChangeReason,
      primaryCharacterId,
      mustKeepCharacterIds: [primaryCharacterId],
      identityGuard,
      continuityChecklist,
      inheritedDimensions,
      continuityPrefix,
      continuitySnapshot,
      plannerBrief,
    };
  }

  /**
   * 在每次 scene plan 落定后更新锚点，使后续 scene 能沿用最新但不漂移的主体状态。
   */
  updateAnchors(plan: StoryboardPlan) {
    this.characterAnchor = {
      ...this.characterAnchor,
      emotionalBaseline: plan.moodTone,
      nonNegotiables: Array.from(
        new Set([
          ...this.characterAnchor.nonNegotiables,
          `主体保持为 ${plan.subject}`,
          `动作承接 ${plan.actionStart} -> ${plan.actionEnd}`,
        ]),
      ),
    };

    this.worldAnchor = {
      ...this.worldAnchor,
      setting: plan.setting,
      timeOfDay: plan.timeOfDay,
      lighting: plan.lighting,
      atmosphere: plan.moodTone,
      continuityRules: Array.from(
        new Set([
          ...this.worldAnchor.continuityRules,
          `镜头延续 ${plan.cameraMovement}`,
          `空间关系保持 ${plan.continuitySummary}`,
        ]),
      ),
    };
  }

  private shouldAllowSceneBreak(segment: LyricsSegment) {
    return (
      segment.sceneChangeSignals.length > 0 ||
      this.transitionKeywords.some((keyword) => segment.text.includes(keyword))
    );
  }
}

function buildSnapshot(previousPlan: StoryboardPlan): ContinuitySnapshot {
  return {
    previousSceneId: previousPlan.sceneId,
    previousSummary: previousPlan.continuitySummary,
    subjectState: previousPlan.subjectState,
    cameraState: `${previousPlan.shotType} / ${previousPlan.cameraMovement}`,
    environmentState: `${previousPlan.setting} / ${previousPlan.lighting}`,
    emotionState: previousPlan.moodTone,
  };
}

function buildPlannerBrief(input: {
  characterAnchor: CharacterAnchor;
  worldAnchor: WorldAnchor;
  inheritedDimensions: InheritedDimension[];
  allowSceneBreak: boolean;
  allowCharacterChange: boolean;
  transitionReason?: string;
  characterChangeReason?: string;
  primaryCharacterId: string;
  mustKeepCharacterIds: string[];
  identityGuard: string;
  continuityChecklist: string[];
  continuitySnapshot?: ContinuitySnapshot;
  continuityPrefix?: string;
}) {
  const lines = [
    `角色锚点：${input.characterAnchor.identity}；主角ID ${input.primaryCharacterId}；外观 ${input.characterAnchor.appearance}；服装 ${input.characterAnchor.wardrobe}；情绪基准 ${input.characterAnchor.emotionalBaseline}。`,
    `世界锚点：场景 ${input.worldAnchor.setting}；时间 ${input.worldAnchor.timeOfDay}；光线 ${input.worldAnchor.lighting}；氛围 ${input.worldAnchor.atmosphere}。`,
    `必须继承：${input.inheritedDimensions.join(", ")}。`,
    `角色锁：${input.identityGuard}`,
    `当前镜必须保留角色：${input.mustKeepCharacterIds.join(", ")}。`,
    input.allowSceneBreak
      ? `允许换场。原因：${input.transitionReason ?? "歌词给出明确转场信号。"}`
      : "不允许突然换地点或换人物，必须延续上一镜的空间与人物状态。",
    input.allowCharacterChange
      ? `允许新增或切换人物。原因：${input.characterChangeReason ?? "歌词明确指向了新人物。"}`
      : "不允许无故更换主角脸、年龄感、发型、服装主色或核心配饰。",
    `连续性检查单：${input.continuityChecklist.join("；")}。`,
  ];

  if (input.continuitySnapshot) {
    lines.push(
      `上一镜摘要：${input.continuitySnapshot.previousSummary ?? "无"}；主体状态：${input.continuitySnapshot.subjectState ?? "无"}；机位：${input.continuitySnapshot.cameraState ?? "无"}；环境：${input.continuitySnapshot.environmentState ?? "无"}；情绪：${input.continuitySnapshot.emotionState ?? "无"}。`,
    );
  }

  if (input.continuityPrefix) {
    lines.push(`承接前缀：${input.continuityPrefix}`);
  }

  return lines.join("\n");
}

function defaultInheritedDimensions(): InheritedDimension[] {
  return ["character_appearance", "wardrobe", "setting", "lighting", "mood_tone"];
}

function minimalInheritedDimensions(): InheritedDimension[] {
  return ["character_appearance", "wardrobe", "mood_tone"];
}

function buildIdentityGuard(input: {
  characterAnchor: CharacterAnchor;
  primaryCharacterId: string;
  allowCharacterChange: boolean;
  characterChangeReason?: string;
}) {
  return [
    `主角ID 固定为 ${input.primaryCharacterId}`,
    `外观保持 ${input.characterAnchor.appearance}`,
    `服装保持 ${input.characterAnchor.wardrobe}`,
    `禁止随机换脸、换发型、换服装主色`,
    input.allowCharacterChange
      ? `仅在歌词明确换人时允许变化：${input.characterChangeReason ?? "有明确人物切换信号"}`
      : "当前镜不允许新增主要人物",
    ...input.characterAnchor.nonNegotiables,
  ].join("；");
}

function buildContinuityChecklist(input: {
  allowSceneBreak: boolean;
  allowCharacterChange: boolean;
  characterAnchor: CharacterAnchor;
  worldAnchor: WorldAnchor;
  previousPlan?: StoryboardPlan;
}) {
  return [
    `主角外观延续为 ${input.characterAnchor.appearance}`,
    `主服装延续为 ${input.characterAnchor.wardrobe}`,
    input.allowSceneBreak ? "允许场景自然转场但仍保留情绪基调" : `主场景延续在 ${input.worldAnchor.setting}`,
    `光线保持 ${input.worldAnchor.lighting}`,
    input.previousPlan ? `镜头节奏衔接 ${input.previousPlan.cameraMovement}` : "首镜负责建立镜头基调",
    input.allowCharacterChange ? "如需换人必须给出明确理由" : "禁止无故引入新主角",
  ];
}

function hasExplicitCharacterShiftSignal(text: string) {
  return [
    "另一个人",
    "另一个我",
    "她出现",
    "他出现",
    "母亲",
    "父亲",
    "少年时的我",
    "多年后的你",
    "小时候的我",
    "陌生人",
  ].some((keyword) => text.includes(keyword));
}

function toCharacterId(identity: string) {
  const normalized = identity
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || "main-character";
}
