import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createGenerationJob,
  getLatestGenerationJobForUser,
} from "@/lib/mv/workflow";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const snapshot = await getLatestGenerationJobForUser(user.id, projectId);
    return NextResponse.json({ snapshot });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GENERATION_JOB_FETCH_FAILED" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId } = await params;

  try {
    const snapshot = await createGenerationJob(user.id, projectId);
    return NextResponse.json({ snapshot });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "GENERATION_JOB_CREATE_FAILED" },
      { status: 500 },
    );
  }
}
