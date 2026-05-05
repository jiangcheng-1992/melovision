import test from "node:test";
import assert from "node:assert/strict";

import {
  buildTimedLyricsForStoryboard,
  estimateStoryboardIntroLeadIn,
  sanitizeLyricsContent,
} from "@/lib/mv/storyboard-timeline";

test("sanitizeLyricsContent removes technical metadata and keeps lyric lines", () => {
  const sanitized = sanitizeLyricsContent(`
    Title: 宝可梦之歌
    Aspect Ratio: 16:9
    第一段歌词
    Performance Mode: cinematic
    第二段歌词
  `);

  assert.equal(sanitized, "第一段歌词\n第二段歌词");
});

test("estimateStoryboardIntroLeadIn reserves intro time for multi-line songs", () => {
  const introLeadInSec = estimateStoryboardIntroLeadIn(
    "第一句歌词\n第二句歌词\n第三句歌词",
    120,
  );

  assert.equal(introLeadInSec, 5);
});

test("buildTimedLyricsForStoryboard shifts the first lyric after intro and preserves ordering", () => {
  const lyrics = buildTimedLyricsForStoryboard(
    "第一句歌词\n第二句歌词\n第三句歌词",
    60,
    4,
  );

  assert.equal(lyrics.length, 3);
  assert.equal(lyrics[0]?.startSec, 4);
  assert.equal(lyrics[0]?.text, "第一句歌词");
  assert.ok((lyrics[0]?.endSec ?? 0) > (lyrics[0]?.startSec ?? 0));
  assert.ok((lyrics[1]?.startSec ?? 0) >= (lyrics[0]?.endSec ?? 0));
  assert.ok((lyrics[2]?.startSec ?? 0) >= (lyrics[1]?.endSec ?? 0));
  assert.equal(lyrics[2]?.endSec, 60);
});

test("buildTimedLyricsForStoryboard falls back to storyboard guidance text when lyrics are empty", () => {
  const lyrics = buildTimedLyricsForStoryboard("", 18, 0);

  assert.equal(lyrics.length, 1);
  assert.match(lyrics[0]?.text ?? "", /开场氛围与情绪推进/);
  assert.equal(lyrics[0]?.startSec, 0);
  assert.equal(lyrics[0]?.endSec, 18);
});
