import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { optimizeStoryboardScene } from "@/lib/mv/workflow";

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
    const scene = await optimizeStoryboardScene(user.id, projectId, sceneId);
    return NextResponse.json({ scene });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "SCENE_OPTIMIZE_FAILED" },
      { status: 500 },
    );
  }
}
