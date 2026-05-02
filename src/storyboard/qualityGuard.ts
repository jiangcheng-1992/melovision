import type { StoryboardOutput } from "@/storyboard/types";

export type StoryboardQualityIssue = {
  sceneId: string;
  severity: "warning" | "critical";
  code:
    | "scene_duration_too_long"
    | "subtitle_too_long"
    | "subtitle_missing"
    | "continuity_missing"
    | "camera_missing"
    | "action_missing"
    | "character_drift";
  message: string;
};

export type StoryboardQualityReport = {
  passed: boolean;
  issues: StoryboardQualityIssue[];
};

/**
 * 在 scene 入库前做一次轻量质量守门，避免明显不适合视频生成的数据继续向下游传播。
 */
export function validateStoryboardOutput(output: StoryboardOutput): StoryboardQualityReport {
  const issues: StoryboardQualityIssue[] = [];
  let previousPrimaryCharacterId: string | undefined;

  for (const scene of output.scenes) {
    const subtitle = scene.plan.subtitleText.trim();

    if (scene.plan.durationSec > 10) {
      issues.push({
        sceneId: scene.plan.sceneId,
        severity: "critical",
        code: "scene_duration_too_long",
        message: "单镜时长超过 10 秒。",
      });
    }

    if (!subtitle) {
      issues.push({
        sceneId: scene.plan.sceneId,
        severity: "critical",
        code: "subtitle_missing",
        message: "缺少可用于字幕展示的歌词文本。",
      });
    } else if (subtitle.replace(/\s+/g, "").length > 20) {
      issues.push({
        sceneId: scene.plan.sceneId,
        severity: "warning",
        code: "subtitle_too_long",
        message: "单镜字幕过长，可能影响短时视频可读性。",
      });
    }

    if (scene.plan.index > 0 && !scene.plan.continuity_with_prev?.trim()) {
      issues.push({
        sceneId: scene.plan.sceneId,
        severity: "critical",
        code: "continuity_missing",
        message: "非首镜缺少 continuity_with_prev。",
      });
    }

    if (!scene.plan.cameraMovement.trim()) {
      issues.push({
        sceneId: scene.plan.sceneId,
        severity: "critical",
        code: "camera_missing",
        message: "缺少镜头运动描述。",
      });
    }

    if (!scene.plan.actionStart.trim() || !scene.plan.actionEnd.trim()) {
      issues.push({
        sceneId: scene.plan.sceneId,
        severity: "critical",
        code: "action_missing",
        message: "缺少动作起点或终点。",
      });
    }

    if (
      previousPrimaryCharacterId &&
      previousPrimaryCharacterId !== scene.plan.primaryCharacterId &&
      !scene.plan.allowCharacterChange
    ) {
      issues.push({
        sceneId: scene.plan.sceneId,
        severity: "critical",
        code: "character_drift",
        message: "未声明换人却发生主角 ID 漂移。",
      });
    }

    previousPrimaryCharacterId = scene.plan.primaryCharacterId;
  }

  return {
    passed: !issues.some((issue) => issue.severity === "critical"),
    issues,
  };
}
