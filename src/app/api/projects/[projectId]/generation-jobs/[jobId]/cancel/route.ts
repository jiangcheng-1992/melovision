import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { cancelGenerationJobForUser } from "@/lib/mv/workflow";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string; jobId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId, jobId } = await params;

  try {
    const snapshot = await cancelGenerationJobForUser(user.id, projectId, jobId);
    return NextResponse.json({ snapshot });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GENERATION_JOB_CANCEL_FAILED" },
      { status: 500 },
    );
  }
}
