import type { PromptBundle } from "@/storyboard/types";

const STORYBOARD_PROMPT_PACKAGE_MARKER = "[[MELOVISION_STORYBOARD_PROMPT_PACKAGE]]";

function isPromptBundle(value: unknown): value is PromptBundle {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.shared_context === "string" &&
    typeof record.cover_prompt === "string" &&
    typeof record.video_prompt === "string" &&
    typeof record.negative_prompt === "string"
  );
}

export function serializeStoryboardPromptBundle(bundle: PromptBundle) {
  return `${bundle.video_prompt}\n\n${STORYBOARD_PROMPT_PACKAGE_MARKER}\n${JSON.stringify(bundle)}`;
}

export function parseStoryboardPromptBundle(rawPrompt?: string | null): PromptBundle | null {
  const source = rawPrompt?.trim();
  if (!source) {
    return null;
  }

  const markerIndex = source.indexOf(STORYBOARD_PROMPT_PACKAGE_MARKER);
  if (markerIndex < 0) {
    return null;
  }

  const jsonText = source
    .slice(markerIndex + STORYBOARD_PROMPT_PACKAGE_MARKER.length)
    .trim();
  if (!jsonText) {
    return null;
  }

  try {
    const parsed = JSON.parse(jsonText) as unknown;
    return isPromptBundle(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function extractStoryboardVideoPrompt(rawPrompt?: string | null) {
  const parsed = parseStoryboardPromptBundle(rawPrompt);
  if (parsed?.video_prompt.trim()) {
    return parsed.video_prompt.trim();
  }

  return rawPrompt?.trim() || "";
}

export function updateStoryboardVideoPrompt(
  rawPrompt: string | null | undefined,
  nextVideoPrompt: string,
) {
  const trimmed = nextVideoPrompt.trim();
  const parsed = parseStoryboardPromptBundle(rawPrompt);
  if (!parsed) {
    return trimmed;
  }

  return serializeStoryboardPromptBundle({
    ...parsed,
    video_prompt: trimmed,
  });
}
