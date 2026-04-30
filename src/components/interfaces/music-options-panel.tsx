"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Download, Pause, Play, RefreshCw } from "lucide-react";

type MusicOption = {
  id: string;
  title: string;
  durationSec: number;
  lyricSnippet: string;
  lyrics?: string | null;
  tags: string;
  artworkUrl: string;
  audioUrl?: string | null;
  isSelected: boolean;
};

type MusicOptionsPanelProps = {
  projectId: string;
  options: MusicOption[];
};

const waveformHeights = [2, 4, 6, 3, 8, 5, 2, 6, 4, 3, 7];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const remain = `${safe % 60}`.padStart(2, "0");
  return `${minutes}:${remain}`;
}

function getDisplayDuration(rawDuration: number, fallbackDuration: number) {
  if (Number.isFinite(rawDuration) && rawDuration > 0) {
    return rawDuration;
  }

  return Math.max(1, fallbackDuration);
}

function getAudioExportHref(projectId: string, optionId: string) {
  return `/api/projects/${projectId}/music-options/${optionId}/audio?download=1`;
}

function getAudioExportFileName(option: MusicOption) {
  const extension = option.audioUrl?.toLowerCase().includes(".wav") ? "wav" : "mp3";
  const title = option.title.trim() || "MeloVision Audio";
  return `${title}.${extension}`;
}

function getLyricLines(option: MusicOption) {
  const source = option.lyrics?.trim() || option.lyricSnippet;
  return source
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function MusicOptionsPanel({ projectId, options }: MusicOptionsPanelProps) {
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [activeOptionId, setActiveOptionId] = useState<string | null>(options[0]?.id ?? null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeLyricLineRef = useRef<HTMLDivElement | null>(null);

  const previewTitle = useMemo(() => {
    if (!previewingId) {
      return null;
    }

    return options.find((option) => option.id === previewingId)?.title ?? null;
  }, [options, previewingId]);

  const activeOption = useMemo(() => {
    return options.find((option) => option.id === activeOptionId) ?? options[0] ?? null;
  }, [activeOptionId, options]);

  const activeLyrics = useMemo(() => {
    return activeOption ? getLyricLines(activeOption) : [];
  }, [activeOption]);

  const activeLyricIndex = useMemo(() => {
    if (!activeLyrics.length) {
      return -1;
    }

    const total = getDisplayDuration(duration, activeOption?.durationSec || 0);
    const ratio = Math.min(0.999, currentTime / total);
    return Math.min(activeLyrics.length - 1, Math.floor(ratio * activeLyrics.length));
  }, [activeLyrics, activeOption?.durationSec, currentTime, duration]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const handleEnded = () => {
      setPreviewingId(null);
      setCurrentTime(0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const syncDuration = () => {
      const fallback = options.find((option) => option.id === activeOptionId)?.durationSec || 0;
      setDuration(getDisplayDuration(audio.duration, fallback));
    };
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("loadeddata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("loadeddata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audioRef.current = null;
    };
  }, [activeOptionId, options]);

  useEffect(() => {
    activeLyricLineRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeLyricIndex]);

  async function handlePreview(option: MusicOption) {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!option.audioUrl) {
      setPreviewError("当前曲目暂时没有可试听的音频地址");
      setPreviewingId(null);
      return;
    }

    setPreviewError(null);
    setActiveOptionId(option.id);

    if (previewingId === option.id) {
      audio.pause();
      audio.currentTime = 0;
      setPreviewingId(null);
      setCurrentTime(0);
      return;
    }

    try {
      audio.pause();
      audio.src = `/api/projects/${projectId}/music-options/${option.id}/audio`;
      audio.currentTime = 0;
      setCurrentTime(0);
      setDuration(getDisplayDuration(0, option.durationSec));
      await audio.play();
      setPreviewingId(option.id);
    } catch {
      setPreviewError("试听失败，请稍后重试");
      setPreviewingId(null);
    }
  }

  function handleSeek(nextValue: number) {
    const audio = audioRef.current;
    if (!audio || !activeOption) {
      return;
    }

    audio.currentTime = nextValue;
    setCurrentTime(nextValue);
    setDuration(getDisplayDuration(audio.duration, activeOption.durationSec));
  }

  return (
    <>
      {previewError ? (
        <div className="mb-5 rounded-lg border border-[#ffb4ab]/20 bg-[#93000a]/10 p-4 text-sm text-[#ffd7d1]">
          {previewError}
        </div>
      ) : null}

      {previewTitle ? (
        <div className="mb-5 rounded-lg border border-[#4cd7f6]/20 bg-[#062230] p-4 text-sm text-[#b6eeff]">
          正在试听：{previewTitle}
        </div>
      ) : null}

      <div className="mb-10 space-y-6">
        {options.map((option, index) => {
          const isPreviewing = previewingId === option.id;

          return (
            <div
              key={option.id}
              className={`relative rounded-xl border p-6 transition-all duration-300 ${
                option.isSelected
                  ? "border-[#4a4455]/20 bg-[#0e0c19] before:pointer-events-none before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-[#d2bbff] before:opacity-100 before:shadow-[0_0_20px_rgba(210,187,255,0.3)]"
                  : "border-[#4a4455]/20 bg-[#0e0c19] hover:-translate-y-1 hover:bg-[#2b2836]"
              }`}
            >
              {option.isSelected ? (
                <div className="absolute top-4 right-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#d2bbff] shadow-[0_0_10px_rgba(210,187,255,0.5)]">
                  <Check className="h-4 w-4 text-[#14121f]" />
                </div>
              ) : null}

              <div className={`flex gap-6 ${option.isSelected ? "flex-col md:flex-row" : "items-center flex-col md:flex-row"}`}>
                <div
                  className={`relative overflow-hidden rounded-lg bg-[#363342] ${
                    option.isSelected ? "h-24 w-24" : "h-16 w-16"
                  } shrink-0`}
                >
                  <img
                    alt="Cover Art"
                    className={`h-full w-full object-cover ${option.isSelected ? "opacity-60" : "opacity-40"} ${index === 2 ? "grayscale" : ""}`}
                    src={option.artworkUrl}
                  />
                  <button
                    type="button"
                    onClick={() => handlePreview(option)}
                    className="absolute inset-0 flex items-center justify-center transition-colors hover:bg-black/20"
                  >
                    <Play
                      className={`${
                        isPreviewing
                          ? "h-10 w-10 fill-current text-[#d2bbff]"
                          : option.isSelected
                            ? "h-10 w-10 fill-current text-[#4cd7f6]"
                            : "h-8 w-8 text-[#ccc3d8] hover:text-[#4cd7f6]"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3
                        className={`mb-1 font-bold ${
                          option.isSelected
                            ? "text-xl text-[#d2bbff]"
                            : "text-lg text-[#e5e0f3]"
                        }`}
                      >
                        {option.title}
                      </h3>
                      <span className="font-mono text-xs text-[#ccc3d8]">
                        Duration: {Math.floor(option.durationSec / 60)}:{(option.durationSec % 60).toString().padStart(2, "0")}
                      </span>
                    </div>
                    {isPreviewing ? (
                      <span className="rounded-full border border-[#4cd7f6]/30 bg-[#4cd7f6]/10 px-3 py-1 text-xs text-[#4cd7f6]">
                        试听中
                      </span>
                    ) : null}
                  </div>

                  {option.isSelected ? (
                    <>
                      <p className="mb-4 text-sm italic text-[#ccc3d8]">
                        "{option.lyricSnippet}"
                      </p>
                      <div className="mb-4 flex gap-2">
                        {option.tags.split(",").map((tag) => (
                          <span
                            key={tag}
                            className="rounded border border-[#4a4455]/30 bg-[#14121f] px-2 py-1 text-xs text-[#4cd7f6]"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="flex h-8 items-center gap-[2px] opacity-80">
                        {waveformHeights.map((height, barIndex) => (
                          <div
                            key={barIndex}
                            className={`w-1 rounded-full ${
                              barIndex < 6 || isPreviewing
                                ? "bg-[#4cd7f6] shadow-[0_0_8px_rgba(76,215,246,0.8)]"
                                : "bg-[#4a4455]"
                            }`}
                            style={{ height: `${height * 4}px` }}
                          />
                        ))}
                      </div>

                      {activeOption?.id === option.id ? (
                        <div className="mt-5 space-y-4 rounded-xl border border-[#4a4455]/20 bg-[#14121f]/70 p-4">
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handlePreview(option)}
                              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d6b7b]/20 text-[#4cd7f6] transition hover:bg-[#1d6b7b]/30"
                            >
                              {isPreviewing ? (
                                <Pause className="h-4 w-4 fill-current" />
                              ) : (
                                <Play className="h-4 w-4 fill-current" />
                              )}
                            </button>
                            <div className="min-w-0 flex-1">
                              <input
                                type="range"
                                min={0}
                                max={getDisplayDuration(duration, option.durationSec)}
                                step={0.1}
                                value={Math.min(currentTime, getDisplayDuration(duration, option.durationSec))}
                                onChange={(event) => handleSeek(Number(event.target.value))}
                                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#2b2836]"
                              />
                              <div className="mt-2 flex items-center justify-between text-xs text-[#958da1]">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(getDisplayDuration(duration, option.durationSec))}</span>
                              </div>
                            </div>
                          </div>

                          <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-[#4a4455]/20 bg-[#0e0c19] p-3">
                            {activeLyrics.length > 0 ? (
                              activeLyrics.map((line, lineIndex) => (
                                <div
                                  key={`${option.id}-lyric-${lineIndex}`}
                                  ref={lineIndex === activeLyricIndex ? activeLyricLineRef : null}
                                  className={`text-sm transition-colors ${
                                    lineIndex === activeLyricIndex
                                      ? "font-medium text-[#4cd7f6]"
                                      : "text-[#958da1]"
                                  }`}
                                >
                                  {line}
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-[#958da1]">当前曲目暂无歌词内容</div>
                            )}
                          </div>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </div>

                <div className="flex w-full shrink-0 flex-col gap-3 md:w-auto">
                  <a
                    href={getAudioExportHref(projectId, option.id)}
                    download={getAudioExportFileName(option)}
                    className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-lg border border-[#4cd7f6]/30 px-4 py-2 text-sm font-medium text-[#4cd7f6] transition-colors hover:bg-[#062230]"
                  >
                    <Download className="h-4 w-4" />
                    导出音频
                  </a>
                  {!option.isSelected ? (
                    <form action={`/api/projects/${projectId}/music/select`} method="POST" className="w-full md:w-auto">
                      <input type="hidden" name="optionId" value={option.id} />
                      <button
                        type="submit"
                        className="w-full rounded-lg border border-[#4a4455]/50 px-6 py-2 text-sm font-medium transition-colors hover:bg-[#363342] hover:text-[#d2bbff]"
                      >
                        选择此项
                      </button>
                    </form>
                  ) : (
                    <div className="rounded-lg border border-[#d2bbff]/30 bg-[#201e2c] px-4 py-2 text-center text-sm text-[#d2bbff]">
                      当前已选
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-8 flex justify-center">
        <form action={`/api/projects/${projectId}/music/regenerate`} method="POST">
          <button
            type="submit"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-[#4a4455]/20 px-6 py-3 text-sm font-medium text-[#ccc3d8] transition-all hover:border-[#4cd7f6]/50 hover:text-[#4cd7f6]"
          >
            <RefreshCw className="h-4 w-4 group-hover:animate-spin" />
            重新生成 (消耗 5 积分)
            <div className="absolute bottom-0 left-1/2 h-[2px] w-0 -translate-x-1/2 bg-[#4cd7f6] transition-all duration-300 group-hover:w-full" />
          </button>
        </form>
      </div>

      <div className="fixed right-0 bottom-0 left-0 z-20 h-20 border-t border-[#4A4455]/20 bg-[#14121F]/90 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] backdrop-blur-lg md:left-72">
        <div className="flex h-full items-center justify-between px-6 md:px-12">
          <Link
            href={`/interfaces/create?projectId=${projectId}`}
            className="flex items-center gap-2 rounded-lg border border-[#4A4455]/40 px-6 py-3 font-headline text-xs font-bold uppercase tracking-widest text-[#E5E0F3] transition-all hover:scale-[1.02] hover:opacity-90 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            返回修改创意
          </Link>

          <Link
            href={`/interfaces/workbench?projectId=${projectId}`}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#03B5D3] px-8 py-3 font-headline text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all hover:scale-[1.02] hover:opacity-90 hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] active:scale-95"
          >
            继续下一步
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
