import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { generateStoryboardSceneVideo } from "@/lib/mv/workflow";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId, sceneId } = await params;

  try {
    const scene = await generateStoryboardSceneVideo(user.id, projectId, sceneId);
    return NextResponse.json({ scene });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SCENE_VIDEO_GENERATE_FAILED" },
      { status: 500 },
    );
  }
}
