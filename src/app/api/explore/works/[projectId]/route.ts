import { NextResponse } from "next/server";
import { getPublicProjectDetailAndTrackPlay } from "@/lib/explore/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const detail = await getPublicProjectDetailAndTrackPlay(projectId);

  if (!detail) {
    return NextResponse.json({ error: "PUBLIC_PROJECT_NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
