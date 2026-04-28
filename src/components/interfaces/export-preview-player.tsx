"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Fullscreen, Pause, Play, Settings, Volume2 } from "lucide-react";
import { InteractiveButton } from "@/components/debug/interactive-button";

type ExportPreviewPlayerProps = {
  title: string;
  visualStyle: string;
  durationLabel: string;
  imageUrl: string;
  videoUrl?: string | null;
  soundtrackUrl?: string | null;
};

function durationToSeconds(value: string) {
  const [minutes, seconds] = value.split(":").map((part) => Number(part));
  return (minutes || 0) * 60 + (seconds || 0);
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remain = `${seconds % 60}`.padStart(2, "0");
  return `${minutes}:${remain}`;
}

export function ExportPreviewPlayer({
  title,
  visualStyle,
  durationLabel,
  imageUrl,
  videoUrl,
  soundtrackUrl,
}: ExportPreviewPlayerProps) {
  const totalSeconds = useMemo(() => durationToSeconds(durationLabel), [durationLabel]);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [captions, setCaptions] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progress = totalSeconds > 0 ? Math.min((currentSeconds / totalSeconds) * 100, 100) : 0;

  useEffect(() => {
    const audio = soundtrackUrl ? new Audio(soundtrackUrl) : null;
    if (audio) {
      audio.preload = "auto";
      audioRef.current = audio;
    } else {
      audioRef.current = null;
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      audioRef.current = null;
    };
  }, [soundtrackUrl]);

  useEffect(() => {
    setCurrentSeconds(0);
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [videoUrl, soundtrackUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
    if (videoRef.current) {
      videoRef.current.muted = Boolean(soundtrackUrl) || muted;
    }
  }, [muted, soundtrackUrl]);

  async function handlePlayToggle() {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (playing) {
      video?.pause();
      audio?.pause();
      setPlaying(false);
      return;
    }

    try {
      if (video) {
        video.currentTime = Math.min(currentSeconds, Math.max(totalSeconds - 0.1, 0));
      }
      if (audio) {
        audio.currentTime = Math.min(currentSeconds, Math.max(totalSeconds - 0.1, 0));
      }

      if (video) {
        await video.play();
      }
      if (audio) {
        await audio.play();
      }
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }

  return (
    <div
      className={`group relative aspect-video w-full overflow-hidden rounded-xl border border-[#4a4455]/20 bg-[#0e0c19] shadow-[0_20px_40px_rgba(3,181,211,0.05)] ${fullscreen ? "ring-2 ring-[#4cd7f6]/40" : ""}`}
    >
      <div className="absolute inset-0 animate-pulse bg-[#363342]">
        {videoUrl ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover opacity-90"
            src={videoUrl}
            controls={false}
            muted={Boolean(soundtrackUrl) || muted}
            playsInline
            onClick={() => void handlePlayToggle()}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onTimeUpdate={(event) =>
              setCurrentSeconds(Math.floor((event.currentTarget as HTMLVideoElement).currentTime))
            }
            onLoadedMetadata={(event) => {
              (event.currentTarget as HTMLVideoElement).currentTime = 0;
              setCurrentSeconds(0);
            }}
          />
        ) : (
          <img alt="Video Preview" className="h-full w-full object-cover opacity-80" src={imageUrl} />
        )}
      </div>

      <div className="pointer-events-none absolute bottom-20 left-0 w-full px-12 text-center">
        <p className="font-display text-2xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          <span className="text-[#4cd7f6]">{title}</span> - {visualStyle}
        </p>
      </div>

      {captions ? (
        <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-4 py-1 text-sm text-white backdrop-blur">
          {playing ? "字幕已开启，预览播放中" : "字幕已开启，点击播放继续预览"}
        </div>
      ) : null}

      {settingsOpen ? (
        <div className="absolute top-4 right-4 rounded-xl border border-[#4a4455]/20 bg-[#1c1a27]/95 p-3 text-xs text-[#ccc3d8] shadow-[0_20px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          当前设置：{captions ? "显示字幕" : "隐藏字幕"} · {muted ? "静音" : "有声"}
        </div>
      ) : null}

      <div className="absolute bottom-0 left-0 flex h-20 w-full flex-col justify-end bg-gradient-to-t from-[#0e0c19]/90 to-transparent px-6 py-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="relative mb-3 flex h-1.5 w-full items-center overflow-hidden rounded-full bg-[#363342]">
          <div className="relative h-full rounded-full bg-[#d2bbff]" style={{ width: `${progress}%` }}>
            <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 rounded-full bg-[#4cd7f6] shadow-[0_0_10px_rgba(76,215,246,0.8)]" />
          </div>
        </div>
        <div className="flex items-center justify-between text-[#e5e0f3]">
          <div className="flex items-center gap-4">
            <InteractiveButton
              type="button"
              actionId="export-player-play-toggle"
              sourcePage="export"
              onClick={() => void handlePlayToggle()}
              className="transition-colors hover:text-[#d2bbff]"
            >
              {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </InteractiveButton>
            <InteractiveButton
              type="button"
              actionId="export-player-volume"
              sourcePage="export"
              onClick={() => setMuted((current) => !current)}
              className={`transition-colors hover:text-[#d2bbff] ${muted ? "opacity-50" : ""}`}
            >
              <Volume2 className="h-5 w-5" />
            </InteractiveButton>
            <span className="text-sm text-[#ccc3d8]">
              {formatDuration(currentSeconds)} / {durationLabel}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <InteractiveButton
              type="button"
              actionId="export-player-cc"
              sourcePage="export"
              onClick={() => setCaptions((current) => !current)}
              className={`transition-colors hover:text-[#4cd7f6] ${captions ? "text-[#4cd7f6]" : ""}`}
            >
              CC
            </InteractiveButton>
            <InteractiveButton
              type="button"
              actionId="export-player-settings"
              sourcePage="export"
              onClick={() => setSettingsOpen((current) => !current)}
              className={`transition-colors hover:text-[#4cd7f6] ${settingsOpen ? "text-[#4cd7f6]" : ""}`}
            >
              <Settings className="h-5 w-5" />
            </InteractiveButton>
            <InteractiveButton
              type="button"
              actionId="export-player-fullscreen"
              sourcePage="export"
              onClick={() => setFullscreen((current) => !current)}
              className={`transition-colors hover:text-[#4cd7f6] ${fullscreen ? "text-[#4cd7f6]" : ""}`}
            >
              <Fullscreen className="h-5 w-5" />
            </InteractiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
