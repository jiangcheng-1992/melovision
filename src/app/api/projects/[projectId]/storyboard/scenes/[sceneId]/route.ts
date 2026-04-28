import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import {
  deleteStoryboardScene,
  updateStoryboardScene,
} from "@/lib/mv/workflow";

const sceneUpdateSchema = z.object({
  prompt: z.string().trim().min(1).max(5000).optional(),
  lyricLine: z.string().trim().min(1).max(500).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId, sceneId } = await params;
  const body = await request.json();
  const parsed = sceneUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_SCENE_UPDATE", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const scene = await updateStoryboardScene(user.id, projectId, sceneId, parsed.data);
    return NextResponse.json({ scene });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SCENE_UPDATE_FAILED" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId, sceneId } = await params;

  try {
    await deleteStoryboardScene(user.id, projectId, sceneId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SCENE_DELETE_FAILED" },
      { status: 500 },
    );
  }
}
