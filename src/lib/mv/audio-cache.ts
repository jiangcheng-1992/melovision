import "server-only";

import { mkdir, readFile, rename, rm, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

import { sanitizeEnvValue } from "@/lib/env";

export type RemoteAudioAsset = {
  ok: boolean;
  status: number;
  contentType: string | null;
  extension: string;
  buffer: Buffer;
};

function parseSqliteFilePath(databaseUrl: string) {
  const normalized = sanitizeEnvValue(databaseUrl);
  if (!normalized.startsWith("file:")) {
    return null;
  }

  const filePath = normalized.slice("file:".length);
  if (!filePath) {
    return null;
  }

  if (filePath.startsWith("/")) {
    return filePath;
  }

  return path.resolve(/* turbopackIgnore: true */ process.cwd(), filePath);
}

function getMediaStorageRoot() {
  const explicitDir = sanitizeEnvValue(process.env.MEDIA_STORAGE_DIR);
  if (explicitDir) {
    return explicitDir;
  }

  const sqlitePath = parseSqliteFilePath(
    sanitizeEnvValue(process.env.DATABASE_URL) || "file:./dev.db",
  );
  if (sqlitePath) {
    return path.join(path.dirname(sqlitePath), "media");
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), ".cache", "media");
}

function getPublicAppUrl() {
  return (
    sanitizeEnvValue(process.env.NEXTAUTH_URL) ||
    sanitizeEnvValue(process.env.NEXT_PUBLIC_APP_URL) ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

function sanitizeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 120) || "asset";
}

export function resolveAudioExtension(contentType: string | null, audioUrl: string) {
  const normalized = (contentType || "").toLowerCase();
  if (normalized.includes("wav")) return "wav";
  if (normalized.includes("mpeg") || normalized.includes("mp3")) return "mp3";
  if (normalized.includes("aac")) return "aac";
  if (normalized.includes("ogg")) return "ogg";
  if (normalized.includes("mp4") || normalized.includes("m4a")) return "m4a";

  try {
    const pathname = new URL(audioUrl).pathname.toLowerCase();
    const matched = pathname.match(/\.([a-z0-9]{2,5})$/);
    if (matched?.[1]) {
      return matched[1];
    }
  } catch {
    // Ignore malformed URLs and fall back to a conservative default.
  }

  return "mp3";
}

export function resolveAudioContentType(extension: string) {
  switch (extension.replace(/^\./, "").toLowerCase()) {
    case "wav":
      return "audio/wav";
    case "aac":
      return "audio/aac";
    case "ogg":
      return "audio/ogg";
    case "m4a":
    case "mp4":
      return "audio/mp4";
    default:
      return "audio/mpeg";
  }
}

export async function fetchRemoteAudioAsset(url: string): Promise<RemoteAudioAsset> {
  const upstream = await fetch(url, {
    cache: "no-store",
    headers: {
      "User-Agent": "MeloVision/1.0",
      Accept: "audio/*,*/*;q=0.8",
    },
  });

  if (!upstream.ok) {
    return {
      ok: false,
      status: upstream.status,
      contentType: upstream.headers.get("content-type"),
      extension: resolveAudioExtension(upstream.headers.get("content-type"), url),
      buffer: Buffer.alloc(0),
    };
  }

  const contentType = upstream.headers.get("content-type") || "audio/mpeg";
  const extension = resolveAudioExtension(contentType, url);
  const arrayBuffer = await upstream.arrayBuffer();

  return {
    ok: true,
    status: upstream.status,
    contentType,
    extension,
    buffer: Buffer.from(arrayBuffer),
  };
}

export function isCacheableRemoteAudioUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  const normalized = value.trim();
  return /^https?:\/\//i.test(normalized) && !normalized.includes("mock-suno.local");
}

export function buildCachedMusicOptionFileName(optionId: string, extension: string) {
  const safeOptionId = sanitizeSegment(optionId);
  const safeExtension = extension.replace(/^\./, "").toLowerCase() || "mp3";
  return `${safeOptionId}.${safeExtension}`;
}

export function buildCachedMusicOptionUrl(projectId: string, optionId: string, extension: string) {
  const safeProjectId = encodeURIComponent(sanitizeSegment(projectId));
  const fileName = encodeURIComponent(buildCachedMusicOptionFileName(optionId, extension));
  return `${getPublicAppUrl()}/api/public/audio-cache/${safeProjectId}/${fileName}`;
}

function getProjectAudioCacheDir(projectId: string) {
  return path.join(getMediaStorageRoot(), "audio-cache", sanitizeSegment(projectId));
}

export async function cacheMusicOptionAudioAsset(input: {
  projectId: string;
  optionId: string;
  sourceUrl?: string | null;
}) {
  const sourceUrl = input.sourceUrl?.trim();
  if (!sourceUrl || !isCacheableRemoteAudioUrl(sourceUrl)) {
    return null;
  }

  const fetched = await fetchRemoteAudioAsset(sourceUrl);
  if (!fetched.ok || fetched.buffer.byteLength === 0) {
    return null;
  }

  const cacheDir = getProjectAudioCacheDir(input.projectId);
  const fileName = buildCachedMusicOptionFileName(input.optionId, fetched.extension);
  const finalPath = path.join(cacheDir, fileName);
  const tempPath = `${finalPath}.tmp`;

  await mkdir(cacheDir, { recursive: true });
  await writeFile(tempPath, fetched.buffer);
  await rename(tempPath, finalPath);

  return buildCachedMusicOptionUrl(input.projectId, input.optionId, fetched.extension);
}

export async function deleteProjectAudioCache(projectId: string) {
  await rm(getProjectAudioCacheDir(projectId), { recursive: true, force: true });
}

export async function deleteMusicOptionAudioCache(projectId: string, optionId: string) {
  const cacheDir = getProjectAudioCacheDir(projectId);
  const safeOptionId = sanitizeSegment(optionId);

  for (const extension of ["mp3", "wav", "aac", "ogg", "m4a", "mp4"]) {
    const candidate = path.join(cacheDir, `${safeOptionId}.${extension}`);
    await unlink(candidate).catch(() => undefined);
  }
}

export async function readCachedMusicOptionAsset(projectId: string, fileName: string) {
  const safeProjectId = sanitizeSegment(projectId);
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeProjectId || !safeFileName || !/^[a-zA-Z0-9_-]+\.[a-z0-9]{2,5}$/i.test(safeFileName)) {
    return null;
  }

  const fullPath = path.join(getMediaStorageRoot(), "audio-cache", safeProjectId, safeFileName);
  const buffer = await readFile(fullPath).catch(() => null);
  if (!buffer) {
    return null;
  }

  const extension = path.extname(safeFileName).replace(/^\./, "").toLowerCase() || "mp3";
  return {
    buffer,
    extension,
    contentType: resolveAudioContentType(extension),
  };
}

export async function readCachedMusicOptionAssetByOption(projectId: string, optionId: string) {
  for (const extension of ["mp3", "wav", "aac", "ogg", "m4a", "mp4"]) {
    const asset = await readCachedMusicOptionAsset(
      projectId,
      buildCachedMusicOptionFileName(optionId, extension),
    );
    if (asset) {
      return asset;
    }
  }

  return null;
}
