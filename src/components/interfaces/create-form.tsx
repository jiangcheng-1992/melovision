"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Clapperboard,
  FilePenLine,
  Music4,
  Palette,
  Settings2,
  Sparkles,
} from "lucide-react";

type VisualStyle = {
  name: string;
  image: string;
};

type CreateFormProps = {
  error?: string;
  visualStyles: VisualStyle[];
  musicStyles: string[];
  initialValues?: {
    projectId?: string;
    title?: string;
    conceptPrompt?: string;
    customLyrics?: string;
    visualStyle?: string;
    musicStyle?: string;
    musicGenerationMode?: "song" | "instrumental";
    consistencyBoost?: boolean;
  };
};

const advancedFieldClassName =
  "min-h-[44px] w-full rounded-[12px] border border-[#4a4455]/30 bg-[#0e0c19] px-4 py-3 text-sm text-[#e5e0f3] transition-all placeholder:text-[#958da1] focus:border-[#d2bbff]/50 focus:ring-1 focus:ring-[#d2bbff]/50 focus:outline-none md:rounded-[16px]";

export function CreateForm({
  error,
  visualStyles,
  musicStyles,
  initialValues,
}: CreateFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [selectedVisualStyle, setSelectedVisualStyle] = useState(
    initialValues?.visualStyle ?? visualStyles[0]?.name ?? "",
  );
  const [selectedMusicStyle, setSelectedMusicStyle] = useState(
    initialValues?.musicStyle ?? musicStyles[0] ?? "",
  );
  const [conceptPrompt, setConceptPrompt] = useState(initialValues?.conceptPrompt ?? "");
  const [customLyrics, setCustomLyrics] = useState(initialValues?.customLyrics ?? "");
  const [musicGenerationMode, setMusicGenerationMode] = useState<"song" | "instrumental">(
    initialValues?.musicGenerationMode ?? "song",
  );
  const [showLyrics, setShowLyrics] = useState(Boolean(initialValues?.customLyrics));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [shotDensity, setShotDensity] = useState("balanced");
  const [performanceMode, setPerformanceMode] = useState("cinematic");
  const [subtitleMode, setSubtitleMode] = useState("stylized");
  const [consistencyBoost, setConsistencyBoost] = useState(
    initialValues?.consistencyBoost ?? true,
  );

  const promptCount = conceptPrompt.length;
  const promptCountTone =
    promptCount > 2000
      ? "text-[#f87171]"
      : promptCount > 1700
        ? "text-[#fbbf24]"
        : "text-[#958da1]";

  const estimatedCredits = useMemo(() => {
    let total = 25;

    if (showLyrics && customLyrics.trim()) {
      total += 5;
    }

    if (showAdvanced && consistencyBoost) {
      total += 3;
    }

    if (showAdvanced && shotDensity === "dense") {
      total += 4;
    }

    return total;
  }, [consistencyBoost, customLyrics, shotDensity, showAdvanced, showLyrics]);

  return (
    <form action="/api/projects/create" method="POST" className="w-full">
      <input type="hidden" name="projectId" value={initialValues?.projectId ?? ""} />
      <input type="hidden" name="aspectRatio" value={aspectRatio} />
      <input type="hidden" name="shotDensity" value={shotDensity} />
      <input type="hidden" name="performanceMode" value={performanceMode} />
      <input type="hidden" name="subtitleMode" value={subtitleMode} />
      <input type="hidden" name="consistencyBoost" value={consistencyBoost ? "true" : "false"} />
      <input type="hidden" name="musicGenerationMode" value={musicGenerationMode} />

      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12">
        <div className="space-y-6 md:space-y-8 lg:col-span-7">
          <div className="rounded-[16px] border border-[#4a4455]/20 bg-[rgba(54,51,66,0.4)] p-5 shadow-[0_8px_32px_0_rgba(124,58,237,0.15)] backdrop-blur-[16px] md:rounded-[24px] md:p-6">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold md:mb-6 md:text-xl">
              <FilePenLine className="h-5 w-5 text-[#d2bbff]" />
              核心创意
            </h2>

            {error ? (
              <div className="mb-4 rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/10 p-3 text-sm text-[#f87171]">
                {error}
              </div>
            ) : null}

            <div className="space-y-5 md:space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#ccc3d8]">
                  给你的 MV 起个名字
                </label>
                <input
                  name="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="min-h-[44px] w-full rounded-[12px] border border-[#4a4455]/30 bg-[#0e0c19] px-4 py-3 text-[#e5e0f3] transition-all placeholder:text-[#958da1] focus:border-[#d2bbff]/50 focus:ring-1 focus:ring-[#d2bbff]/50 focus:outline-none md:rounded-[16px]"
                  placeholder="例如：星际之旅"
                  type="text"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-end justify-between">
                  <label className="block text-sm font-medium text-[#ccc3d8]">
                    描述你的 MV 创意
                  </label>
                  <span className={`text-xs ${promptCountTone}`}>{promptCount} / 2000</span>
                </div>
                <textarea
                  name="conceptPrompt"
                  value={conceptPrompt}
                  onChange={(event) => setConceptPrompt(event.target.value.slice(0, 2000))}
                  className="min-h-[120px] w-full resize-none rounded-[12px] border border-[#4a4455]/30 bg-[#0e0c19] px-4 py-3 font-body text-[#e5e0f3] transition-all placeholder:text-[#958da1] focus:border-[#d2bbff]/50 focus:ring-1 focus:ring-[#d2bbff]/50 focus:outline-none md:rounded-[16px]"
                  placeholder="描述你想要的氛围、故事和感觉..."
                  rows={6}
                  required
                />
              </div>

              <div className="rounded-[16px] border border-[#4a4455]/20 bg-[#14121f]/70 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#e5e0f3]">
                  <Music4 className="h-4 w-4 text-[#ffb690]" />
                  音乐生成模式
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "song" as const,
                      label: "歌曲",
                      description: "默认模式。没填歌词时会先自动生成歌词，再生成人声歌曲。",
                    },
                    {
                      value: "instrumental" as const,
                      label: "纯音乐",
                      description: "只生成伴奏和氛围音乐，不强制做人声演唱。",
                    },
                  ].map((option) => {
                    const active = musicGenerationMode === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setMusicGenerationMode(option.value)}
                        className={`rounded-[14px] border px-4 py-3 text-left transition-colors ${
                          active
                            ? "border-[#d2bbff] bg-[#201e2c] text-[#e5e0f3]"
                            : "border-[#4a4455]/30 bg-[#0e0c19] text-[#ccc3d8] hover:border-[#4a4455]"
                        }`}
                      >
                        <div className="text-sm font-semibold">{option.label}</div>
                        <div className="mt-1 text-xs text-[#958da1]">{option.description}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#201e2c] pt-2">
                <button
                  type="button"
                  onClick={() => setShowLyrics((current) => !current)}
                  aria-expanded={showLyrics}
                  className="group flex min-h-[44px] w-full items-center justify-between py-3 text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-[#e5e0f3] transition-colors group-hover:text-[#d2bbff]">
                    <FilePenLine className="h-4 w-4" />
                    📝 添加自定义歌词 (可选)
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#958da1] transition-all group-hover:text-[#d2bbff] ${showLyrics ? "rotate-180" : ""}`}
                  />
                </button>

                {showLyrics ? (
                  <div className="mt-3">
                    <textarea
                      name="customLyrics"
                      value={customLyrics}
                      onChange={(event) => setCustomLyrics(event.target.value)}
                      className="min-h-[80px] w-full resize-none rounded-[12px] border border-[#4a4455]/30 bg-[#0e0c19] px-4 py-3 font-body text-[#e5e0f3] transition-all placeholder:text-[#958da1] focus:border-[#d2bbff]/50 focus:ring-1 focus:ring-[#d2bbff]/50 focus:outline-none md:rounded-[16px]"
                      placeholder="输入你的歌词，系统会优先按你的词来生成旋律与情绪..."
                      rows={4}
                    />
                    <p className="mt-2 text-xs text-[#958da1]">
                      在“歌曲”模式下，留空会先自动生成歌词；在“纯音乐”模式下会忽略歌词并生成伴奏。
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-[16px] border border-[#4a4455]/20 bg-[rgba(54,51,66,0.4)] p-5 backdrop-blur-[16px] md:rounded-[24px] md:p-6">
            <button
              type="button"
              onClick={() => setShowAdvanced((current) => !current)}
              aria-expanded={showAdvanced}
              className="group flex min-h-[44px] w-full items-center justify-between py-1 text-left"
            >
              <span className="flex items-center gap-2 font-semibold transition-colors group-hover:text-[#d2bbff]">
                <Settings2 className="h-5 w-5" />
                高级设置
              </span>
              <ChevronDown
                className={`h-4 w-4 text-[#958da1] transition-all group-hover:text-[#d2bbff] ${showAdvanced ? "rotate-180" : ""}`}
              />
            </button>

            {showAdvanced ? (
              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#ccc3d8]">
                    画幅比例
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["16:9", "9:16", "1:1"].map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`min-h-[44px] rounded-full border px-3 text-sm transition-colors ${
                          aspectRatio === ratio
                            ? "border-[#d2bbff] bg-[#201e2c] text-[#d2bbff]"
                            : "border-[#4a4455]/30 bg-[#0e0c19] text-[#ccc3d8] hover:border-[#4a4455]"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#ccc3d8]">
                    镜头密度
                  </label>
                  <select
                    value={shotDensity}
                    onChange={(event) => setShotDensity(event.target.value)}
                    className={advancedFieldClassName}
                  >
                    <option value="slow">舒缓叙事</option>
                    <option value="balanced">平衡节奏</option>
                    <option value="dense">高能快切</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#ccc3d8]">
                    表演模式
                  </label>
                  <select
                    value={performanceMode}
                    onChange={(event) => setPerformanceMode(event.target.value)}
                    className={advancedFieldClassName}
                  >
                    <option value="cinematic">电影叙事</option>
                    <option value="idol">人物主唱</option>
                    <option value="atmospheric">氛围意象</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#ccc3d8]">
                    字幕风格
                  </label>
                  <select
                    value={subtitleMode}
                    onChange={(event) => setSubtitleMode(event.target.value)}
                    className={advancedFieldClassName}
                  >
                    <option value="stylized">风格化字幕</option>
                    <option value="minimal">极简字幕</option>
                    <option value="karaoke">卡拉 OK 节奏字幕</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center justify-between rounded-[16px] border border-[#4a4455]/20 bg-[#0e0c19] px-4 py-3">
                    <div>
                      <span className="block text-sm font-medium text-[#e5e0f3]">
                        角色一致性增强
                      </span>
                      <span className="text-xs text-[#958da1]">
                        在后续分镜和画面生成时尽量保持主角造型稳定
                      </span>
                    </div>
                    <span
                      className={`relative h-6 w-11 rounded-full transition-colors ${consistencyBoost ? "bg-[#7c3aed]" : "bg-[#363342]"}`}
                    >
                      <input
                        type="checkbox"
                        checked={consistencyBoost}
                        onChange={(event) => setConsistencyBoost(event.target.checked)}
                        className="sr-only"
                      />
                      <span
                        className={`absolute top-[2px] h-5 w-5 rounded-full bg-white transition-transform ${consistencyBoost ? "left-[22px]" : "left-[2px]"}`}
                      />
                    </span>
                  </label>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 lg:col-span-5">
          <div className="rounded-[16px] border border-[#4a4455]/20 bg-[rgba(54,51,66,0.4)] p-5 backdrop-blur-[16px] md:rounded-[24px] md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold md:text-xl">
              <Palette className="h-5 w-5 text-[#4cd7f6]" />
              视觉风格
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {visualStyles.map((style) => {
                const active = selectedVisualStyle === style.name;

                return (
                  <label
                    key={style.name}
                    className={`group relative cursor-pointer overflow-hidden rounded-[12px] border-2 transition-colors md:rounded-[16px] ${
                      active
                        ? "border-[#d2bbff] shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                        : "border-transparent hover:border-[#4a4455]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="visualStyle"
                      value={style.name}
                      checked={active}
                      onChange={() => setSelectedVisualStyle(style.name)}
                      className="sr-only"
                      required
                    />
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#14121f] to-transparent opacity-80" />
                    <img
                      alt={style.name}
                      className="h-20 w-full object-cover md:h-24"
                      src={style.image}
                    />
                    <span
                      className={`absolute bottom-2 left-3 z-20 text-xs font-medium md:text-sm ${
                        active ? "text-white" : "text-[#ccc3d8]"
                      }`}
                    >
                      {style.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="rounded-[16px] border border-[#4a4455]/20 bg-[rgba(54,51,66,0.4)] p-5 backdrop-blur-[16px] md:rounded-[24px] md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold md:text-xl">
              <Music4 className="h-5 w-5 text-[#ffb690]" />
              音乐风格
            </h2>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {musicStyles.map((style) => {
                const active = selectedMusicStyle === style;

                return (
                  <label
                    key={style}
                    className={`min-h-[44px] cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "border-[#d2bbff] bg-[#201e2c] text-[#d2bbff]"
                        : "border-[#4a4455]/30 bg-[#201e2c] text-[#ccc3d8] hover:border-[#4a4455]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="musicStyle"
                      value={style}
                      checked={active}
                      onChange={() => setSelectedMusicStyle(style)}
                      className="sr-only"
                      required
                    />
                    {style}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 z-50 flex w-full flex-col items-center justify-between gap-3 border-t border-[#4a4455]/20 bg-[#363342]/60 px-4 py-3 shadow-[0_-8px_40px_-12px_rgba(124,58,237,0.3)] backdrop-blur-2xl md:flex-row md:gap-0 md:px-8 md:py-4">
        <div className="flex w-full items-center justify-center gap-2 text-sm font-medium text-[#e5e0f3] md:w-auto md:justify-start md:text-base">
          <Sparkles className="h-4 w-4 text-[#4cd7f6]" />
          预计消耗: {estimatedCredits} 积分
        </div>
        <button
          type="submit"
          className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-[1.02] md:w-auto md:px-8 md:text-base"
        >
          <Clapperboard className="h-4 w-4" />
          开始生成音乐 →
        </button>
      </div>
    </form>
  );
}
