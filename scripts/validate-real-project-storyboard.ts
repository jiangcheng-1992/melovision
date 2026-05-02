import { generateStoryboard, validateStoryboardOutput } from "@/storyboard";
import { prisma } from "@/lib/prisma";

type ProjectRecord = {
  id: string;
  userId: string;
  title: string;
  conceptPrompt: string;
  customLyrics: string | null;
  visualStyle: string;
  musicStyle: string;
};

function inferCharacterAnchor(project: ProjectRecord) {
  return {
    identity: "核心主角",
    appearance: "东亚青年脸部轮廓清晰，五官稳定，适合连续镜头呈现",
    wardrobe: `${project.visualStyle} 风格下保持统一主服装与配饰，不随镜头随机变化`,
    emotionalBaseline: "情绪连续、克制但有推进感",
    nonNegotiables: [
      "禁止无故切换成完全不同的人脸",
      "禁止随机新增主要人物",
      "禁止突然切换主服装主色",
    ],
  };
}

function inferWorldAnchor(project: ProjectRecord) {
  return {
    setting: project.conceptPrompt.slice(0, 60) || "围绕当前 MV 概念设定的统一主空间",
    timeOfDay: "按歌词主情绪自然连续推进",
    lighting: "整体光线连续，不随镜头随机跳变",
    atmosphere: `${project.visualStyle} 风格下的统一电影氛围`,
    continuityRules: [
      "无明确换场信号时不突然切换地点",
      "无明确换人信号时不突然切换主角",
    ],
  };
}

function buildTimedLyrics(rawLyrics: string) {
  const parts = rawLyrics
    .split(/\r?\n/)
    .flatMap((line) => line.split(/[。！？!?]/))
    .map((part) => part.trim())
    .filter(Boolean);

  const safeParts = parts.length > 0 ? parts : ["为当前 MV 建立开场氛围与情绪推进镜头"];
  const averageDuration = 4.5;

  return safeParts.map((text, index) => {
    const startSec = Number((index * averageDuration).toFixed(3));
    const endSec = Number(((index + 1) * averageDuration).toFixed(3));
    return { text, startSec, endSec };
  });
}

async function main() {
  const target = await prisma.mvProject.findFirst({
    where: {
      customLyrics: {
        not: null,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      userId: true,
      title: true,
      conceptPrompt: true,
      customLyrics: true,
      visualStyle: true,
      musicStyle: true,
    },
  });

  if (!target?.customLyrics?.trim()) {
    console.log(
      JSON.stringify(
        {
          passed: false,
          error: "NO_REAL_PROJECT_LYRICS_FOUND",
        },
        null,
        2,
      ),
    );
    return;
  }

  const storyboard = await generateStoryboard({
    project: {
      title: target.title,
      concept: target.conceptPrompt,
      visualStyle: target.visualStyle,
      musicStyle: target.musicStyle,
      language: "zh-CN",
      aspectRatio: "16:9",
    },
    lyrics: buildTimedLyrics(target.customLyrics),
    characterAnchor: inferCharacterAnchor(target),
    worldAnchor: inferWorldAnchor(target),
    llm: {
      async invoke(_systemPrompt, userPrompt, schema) {
        const subtitleText =
          userPrompt.match(/- subtitleText:\s*(.+)/)?.[1]?.trim() || "当前歌词";
        const allowSceneBreak = userPrompt.includes("允许换场");
        return schema.parse({
          subtitleText,
          lyricIntent: `围绕“${subtitleText}”表达当前歌词段的情绪推进与叙事重点。`,
          narrativePurpose: `围绕“${subtitleText}”建立当前镜头叙事推进。`,
          emotionalSubtext: `表达“${subtitleText}”背后的潜台词与情绪流动。`,
          subject: "核心主角",
          primaryCharacterId: "main-character",
          visibleCharacterIds: ["main-character"],
          allowCharacterChange: false,
          characterChangeReason: undefined,
          identityGuard: "固定同一主角外观、发型、服装和空间方向，禁止无故换人。",
          subjectState: "延续上一镜的情绪与动作惯性，保持视觉主体稳定。",
          actionStart: `从“${subtitleText}”对应的情绪起点进入动作。`,
          actionEnd: `在当前镜头内完成该歌词段的动作收束。`,
          setting: allowSceneBreak ? "根据歌词允许自然过渡到新空间" : "延续上一镜主场景",
          timeOfDay: "按当前歌词情绪自然承接",
          lighting: "保持统一光影与主体辨识度",
          moodTone: "电影感、情绪连贯、主体明确",
          shotType: "中近景到中景",
          cameraMovement: "轻推、跟拍或平移，避免突兀跳动",
          visualFocus: `${subtitleText} 对应的主体神态、动作和空间关系`,
          coverMoment: `定格“${subtitleText}”中最能代表情绪推进的一瞬`,
          continuitySummary: "承接上一镜的人物、情绪和空间关系，继续推动叙事。",
          continuity_with_prev: "承接上一镜的主体状态与空间方向，平滑过渡到当前分镜。",
          sceneChangeAllowed: allowSceneBreak,
          transitionReason: allowSceneBreak ? "歌词中存在明确换场信号。" : undefined,
          inheritedDimensions: allowSceneBreak
            ? ["character_appearance", "wardrobe", "mood_tone"]
            : ["character_appearance", "wardrobe", "setting", "lighting", "mood_tone"],
          continuityChecklist: [
            "主角外观保持一致",
            "服装和主色保持一致",
            "空间与机位自然承接",
          ],
        });
      },
    },
    segmenterOptions: {
      maxSceneDurationSec: 8,
      minSceneDurationSec: 2.5,
      maxCharsPerSegment: 18,
      maxLinesPerSegment: 2,
    },
  });

  const quality = validateStoryboardOutput(storyboard);
  const sceneSummary = storyboard.scenes.map((scene) => ({
    sceneId: scene.plan.sceneId,
    subtitleText: scene.plan.subtitleText,
    lyricText: scene.plan.lyricText,
    primaryCharacterId: scene.plan.primaryCharacterId,
    continuity: scene.plan.continuity_with_prev ?? null,
    startSec: scene.plan.startSec,
    endSec: scene.plan.endSec,
    durationSec: scene.plan.durationSec,
  }));

  console.log(
    JSON.stringify(
      {
        passed: quality.passed,
        project: {
          id: target.id,
          title: target.title,
        },
        qualityIssues: quality.issues,
        sceneSummary,
      },
      null,
      2,
    ),
  );
}

void main();
