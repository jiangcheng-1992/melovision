import type { z } from "zod";

import { generateStoryboard } from "@/storyboard";
import type {
  GenerateStoryboardInput,
  LLMClient,
  StoryboardPlan,
  TimedLyricLine,
} from "@/storyboard/types";

const demoLyrics: TimedLyricLine[] = [
  { text: "地铁门关上以后 你还站在原地看着我", startSec: 0, endSec: 5.2 },
  { text: "耳机里的鼓点像心跳 把没说完的话推向夜色", startSec: 5.2, endSec: 9.8 },
  { text: "我回到梦里 又看见那天站台潮湿的风", startSec: 9.8, endSec: 15.6 },
  { text: "多年后 雨停了 城市仍记得我们的轮廓", startSec: 15.6, endSec: 23.8 },
];

const mockLlm: LLMClient = {
  async invoke<TSchema extends z.ZodTypeAny>(
    _systemPrompt: string,
    userPrompt: string,
    schema: TSchema,
  ): Promise<z.infer<TSchema>> {
    const responses: StoryboardPlan[] = [
      {
        sceneId: "scene-1",
        index: 0,
        lyricText: "",
        startSec: 0,
        endSec: 0,
        durationSec: 0,
        narrativePurpose: "建立主角与地铁站台的离别情境，压住即将失去的情绪。",
        emotionalSubtext: "想挽留却克制住开口。",
        subject: "年轻男主",
        subjectState: "站在地铁车门内侧，视线仍停留在站台上的对方身上。",
        actionStart: "列车将要启动，男主回头望向站台",
        actionEnd: "车门闭合后，男主慢慢转回正面却仍在余光里寻找对方",
        setting: "夜晚的城市地铁站台",
        timeOfDay: "夜晚",
        lighting: "冷色站台灯和车厢补光",
        moodTone: "克制而刺痛",
        shotType: "中近景切主观视角",
        cameraMovement: "轻微前推后停住",
        visualFocus: "男主侧脸、车门玻璃反光、站台上的对方身影",
        coverMoment: "车门将要闭合的一瞬，男主与站台上的对方视线仍然相连",
        continuitySummary: "在地铁离站前的最后一秒建立离别张力。",
        continuity_with_prev: undefined,
        sceneChangeAllowed: false,
        transitionReason: undefined,
        inheritedDimensions: ["character_appearance", "wardrobe", "setting", "lighting", "mood_tone"],
        continuitySnapshot: undefined,
      },
      {
        sceneId: "scene-2",
        index: 1,
        lyricText: "",
        startSec: 0,
        endSec: 0,
        durationSec: 0,
        narrativePurpose: "把外在列车启动和内在心跳加速并置，推动情绪进入余震期。",
        emotionalSubtext: "没说出口的话在胸口翻涌。",
        subject: "年轻男主",
        subjectState: "身体被列车带走，心绪仍滞留在站台。",
        actionStart: "列车缓慢出站，男主低头听见耳机鼓点",
        actionEnd: "他抬眼看向窗外，霓虹与站台残影滑过脸侧",
        setting: "行进中的地铁车厢",
        timeOfDay: "夜晚",
        lighting: "车厢冷白灯混合窗外霓虹",
        moodTone: "失重、心跳加快",
        shotType: "中景到近景",
        cameraMovement: "跟随式轻摇镜头",
        visualFocus: "耳机、脉搏感、窗外拉伸的霓虹反射",
        coverMoment: "霓虹掠过男主面部，耳机鼓点与心跳同频的一瞬",
        continuitySummary: "沿着离别情绪，把注意力从对方转向男主内心震荡。",
        continuity_with_prev: "承接上一镜车门闭合后的余波，镜头顺着列车启动把离别感推进到男主内心。",
        sceneChangeAllowed: false,
        transitionReason: undefined,
        inheritedDimensions: ["character_appearance", "wardrobe", "lighting", "mood_tone"],
        continuitySnapshot: undefined,
      },
      {
        sceneId: "scene-3",
        index: 2,
        lyricText: "",
        startSec: 0,
        endSec: 0,
        durationSec: 0,
        narrativePurpose: "进入梦境回闪，用相同站台意象把现实情绪拖入记忆层。",
        emotionalSubtext: "怀念与未完成感被重新唤醒。",
        subject: "年轻男主",
        subjectState: "像被记忆牵引般停在旧日站台的风里。",
        actionStart: "现实中的霓虹倒影渐渐虚化成梦境站台",
        actionEnd: "男主站定在潮湿站台，风吹动衣角与发梢",
        setting: "梦境中的旧站台",
        timeOfDay: "蓝调夜色",
        lighting: "潮湿空气中的漫反射路灯",
        moodTone: "怀旧、惆怅",
        shotType: "中远景",
        cameraMovement: "缓慢推入并轻微环绕",
        visualFocus: "潮湿地面反光、风吹衣角、若有若无的旧日身影",
        coverMoment: "男主在潮湿站台回身，风吹起衣角的一瞬",
        continuitySummary: "通过梦境转场把现实的离别情绪延展成记忆回闪。",
        continuity_with_prev: "承接上一镜窗外掠过的霓虹，将现实车窗反光化成梦境站台的潮湿风感。",
        sceneChangeAllowed: true,
        transitionReason: "歌词出现“回到梦里”，允许从现实车厢切入梦境站台。",
        inheritedDimensions: ["character_appearance", "wardrobe", "mood_tone"],
        continuitySnapshot: undefined,
      },
      {
        sceneId: "scene-4",
        index: 3,
        lyricText: "",
        startSec: 0,
        endSec: 0,
        durationSec: 0,
        narrativePurpose: "把记忆时间线拉远到多年后，以雨停后的城市完成情绪落点。",
        emotionalSubtext: "遗憾被时间稀释，但轮廓仍留在城市里。",
        subject: "成年后的男主",
        subjectState: "站在雨停后的街角，平静地与记忆和解。",
        actionStart: "镜头从潮湿站台的反光切到多年后雨后的城市街角",
        actionEnd: "男主缓慢停步，看向远处熟悉的轮廓后轻轻呼气",
        setting: "雨停后的城市街角",
        timeOfDay: "清晨将亮未亮",
        lighting: "雨后柔和天光与路灯余辉",
        moodTone: "释然中带回响",
        shotType: "远景过渡到中景",
        cameraMovement: "低速平移后轻推",
        visualFocus: "湿润街面、城市轮廓、男主停步的背影",
        coverMoment: "雨停后男主停步，城市轮廓在湿润路面上映出的那一刻",
        continuitySummary: "用时间跳切完成情绪收束，让城市替人物保存记忆。",
        continuity_with_prev: "承接上一镜梦境中的潮湿风感，把水汽和余情落到多年后的现实城市。",
        sceneChangeAllowed: true,
        transitionReason: "歌词出现“多年后”“雨停了”，允许时间线与地点共同转场。",
        inheritedDimensions: ["character_appearance", "wardrobe", "mood_tone"],
        continuitySnapshot: undefined,
      },
    ];

    const picked = pickPlanByPrompt(userPrompt, responses);
    return schema.parse({
      ...picked,
    });
  },
};

function pickPlanByPrompt(userPrompt: string, responses: StoryboardPlan[]) {
  const currentText = userPrompt.match(/- text:\s*(.+)/)?.[1] ?? userPrompt;

  if (currentText.includes("回到梦里")) {
    return responses[2];
  }

  if (currentText.includes("多年后") || currentText.includes("雨停了")) {
    return responses[3];
  }

  if (currentText.includes("耳机里的鼓点") || currentText.includes("推向夜色")) {
    return responses[1];
  }

  return responses[0];
}

async function main() {
  const input: GenerateStoryboardInput = {
    project: {
      title: "大钟寺奇遇记",
      concept: "一支围绕地铁离别、回忆和多年后释然的都市情绪 MV。",
      visualStyle: "anime cinematic, grounded city romance",
      musicStyle: "city pop ballad",
      language: "zh-CN",
      aspectRatio: "16:9",
    },
    lyrics: demoLyrics,
    characterAnchor: {
      identity: "年轻男主",
      appearance: "黑发、清瘦、东亚青年轮廓",
      wardrobe: "深色轻薄外套、耳机、通勤装",
      emotionalBaseline: "克制但感受浓烈",
      nonNegotiables: ["不要突然变成多人群像", "不要更换核心穿搭"],
    },
    worldAnchor: {
      setting: "北京城市轨道交通与周边街景",
      timeOfDay: "夜晚",
      lighting: "冷色人造光与霓虹反射",
      atmosphere: "潮湿、安静、带有离别感",
      continuityRules: ["无转场信号时不突然离开城市交通空间"],
    },
    llm: mockLlm,
  };

  const storyboard = await generateStoryboard(input);
  console.log(JSON.stringify(storyboard, null, 2));
}

void main();
