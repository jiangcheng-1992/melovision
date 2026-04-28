-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MvProject" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "conceptPrompt" TEXT NOT NULL,
    "customLyrics" TEXT,
    "visualStyle" TEXT NOT NULL,
    "musicStyle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "generationStatus" TEXT NOT NULL DEFAULT 'draft',
    "generationProgress" INTEGER NOT NULL DEFAULT 0,
    "selectedMusicOptionId" TEXT,
    "subtitleStyle" TEXT NOT NULL DEFAULT '发光霓虹 (Neon Glow)',
    "fontSize" INTEGER NOT NULL DEFAULT 70,
    "exportResolution" TEXT NOT NULL DEFAULT '1080p HD',
    "published" BOOLEAN NOT NULL DEFAULT true,
    "coverVersion" INTEGER NOT NULL DEFAULT 1,
    "coverImageUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MvProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MusicOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "lyricSnippet" TEXT NOT NULL,
    "durationSec" INTEGER NOT NULL,
    "bpm" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "artworkUrl" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "providerRef" TEXT,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MusicOption_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MvProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StoryboardScene" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "startSec" INTEGER NOT NULL,
    "endSec" INTEGER NOT NULL,
    "lyricLine" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "previewImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ready',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StoryboardScene_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MvProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GenerationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GenerationLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MvProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "MvProject_userId_idx" ON "MvProject"("userId");

-- CreateIndex
CREATE INDEX "MvProject_status_idx" ON "MvProject"("status");

-- CreateIndex
CREATE INDEX "MvProject_generationStatus_idx" ON "MvProject"("generationStatus");

-- CreateIndex
CREATE INDEX "MusicOption_projectId_idx" ON "MusicOption"("projectId");

-- CreateIndex
CREATE INDEX "StoryboardScene_projectId_idx" ON "StoryboardScene"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryboardScene_projectId_sortOrder_key" ON "StoryboardScene"("projectId", "sortOrder");

-- CreateIndex
CREATE INDEX "GenerationLog_projectId_idx" ON "GenerationLog"("projectId");
