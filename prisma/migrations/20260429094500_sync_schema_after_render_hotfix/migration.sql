-- AlterTable
ALTER TABLE "MusicOption" ADD COLUMN "audioUrl" TEXT;
ALTER TABLE "MusicOption" ADD COLUMN "lyrics" TEXT;

-- AlterTable
ALTER TABLE "StoryboardScene" ADD COLUMN "continuityLine" TEXT;
ALTER TABLE "StoryboardScene" ADD COLUMN "generationTaskId" TEXT;
ALTER TABLE "StoryboardScene" ADD COLUMN "resultVideoUrl" TEXT;

-- CreateTable
CREATE TABLE "GenerationJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "providerTaskId" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "totalScenes" INTEGER NOT NULL DEFAULT 0,
    "completedScenes" INTEGER NOT NULL DEFAULT 0,
    "resultVideoUrl" TEXT,
    "resultLastFrameUrl" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "cancelledAt" DATETIME,
    "errorMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GenerationJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MvProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExportJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "resolution" TEXT NOT NULL,
    "subtitleStyle" TEXT NOT NULL,
    "fontSize" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "fileName" TEXT,
    "outputMimeType" TEXT,
    "outputContent" TEXT,
    "errorMessage" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ExportJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MvProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "StoryboardSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "styleTagsJson" TEXT NOT NULL DEFAULT '[]',
    "consistencyBoost" BOOLEAN NOT NULL DEFAULT true,
    "transitionStyle" TEXT NOT NULL DEFAULT '平滑淡入淡出 (Crossfade)',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "StoryboardSettings_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MvProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserBillingProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "planCode" TEXT NOT NULL DEFAULT 'free',
    "billingCycle" TEXT NOT NULL DEFAULT 'yearly',
    "creditBalance" INTEGER NOT NULL DEFAULT 10,
    "periodStartedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "periodEndsAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserBillingProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "referenceCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GenerationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "jobId" TEXT,
    "level" TEXT NOT NULL DEFAULT 'info',
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GenerationLog_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "MvProject" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GenerationLog_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "GenerationJob" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GenerationLog" ("createdAt", "id", "level", "message", "projectId") SELECT "createdAt", "id", "level", "message", "projectId" FROM "GenerationLog";
DROP TABLE "GenerationLog";
ALTER TABLE "new_GenerationLog" RENAME TO "GenerationLog";
CREATE INDEX "GenerationLog_projectId_idx" ON "GenerationLog"("projectId");
CREATE INDEX "GenerationLog_jobId_idx" ON "GenerationLog"("jobId");
CREATE TABLE "new_MvProject" (
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
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "coverVersion" INTEGER NOT NULL DEFAULT 1,
    "coverImageUrl" TEXT,
    "generatedVideoUrl" TEXT,
    "generatedLastFrameUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MvProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MvProject" ("conceptPrompt", "coverImageUrl", "coverVersion", "createdAt", "customLyrics", "exportResolution", "fontSize", "generationProgress", "generationStatus", "id", "musicStyle", "published", "selectedMusicOptionId", "status", "subtitleStyle", "title", "updatedAt", "userId", "visualStyle") SELECT "conceptPrompt", "coverImageUrl", "coverVersion", "createdAt", "customLyrics", "exportResolution", "fontSize", "generationProgress", "generationStatus", "id", "musicStyle", "published", "selectedMusicOptionId", "status", "subtitleStyle", "title", "updatedAt", "userId", "visualStyle" FROM "MvProject";
DROP TABLE "MvProject";
ALTER TABLE "new_MvProject" RENAME TO "MvProject";
CREATE INDEX "MvProject_userId_idx" ON "MvProject"("userId");
CREATE INDEX "MvProject_status_idx" ON "MvProject"("status");
CREATE INDEX "MvProject_generationStatus_idx" ON "MvProject"("generationStatus");
CREATE INDEX "MvProject_published_status_idx" ON "MvProject"("published", "status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "GenerationJob_projectId_idx" ON "GenerationJob"("projectId");

-- CreateIndex
CREATE INDEX "GenerationJob_status_idx" ON "GenerationJob"("status");

-- CreateIndex
CREATE INDEX "GenerationJob_projectId_createdAt_idx" ON "GenerationJob"("projectId", "createdAt");

-- CreateIndex
CREATE INDEX "ExportJob_projectId_idx" ON "ExportJob"("projectId");

-- CreateIndex
CREATE INDEX "ExportJob_status_idx" ON "ExportJob"("status");

-- CreateIndex
CREATE UNIQUE INDEX "StoryboardSettings_projectId_key" ON "StoryboardSettings"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBillingProfile_userId_key" ON "UserBillingProfile"("userId");

-- CreateIndex
CREATE INDEX "UserBillingProfile_planCode_idx" ON "UserBillingProfile"("planCode");

-- CreateIndex
CREATE INDEX "CreditTransaction_userId_createdAt_idx" ON "CreditTransaction"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "CreditTransaction_type_idx" ON "CreditTransaction"("type");
