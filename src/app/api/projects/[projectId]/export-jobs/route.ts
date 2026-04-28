import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import {
  createExportJob,
  getLatestExportJobForUser,
} from "@/lib/mv/workflow";

const createExportJobSchema = z.object({
  resolution: z.string().trim().min(1),
  subtitleStyle: z.string().trim().min(1),
  fontSize: z.number().int().min(20).max(100),
  published: z.boolean(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId } = await params;
  const job = await getLatestExportJobForUser(user.id, projectId);

  return NextResponse.json({ job });
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
  const body = await request.json();
  const parsed = createExportJobSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "INVALID_EXPORT_SETTINGS",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  try {
    const job = await createExportJob(user.id, projectId, parsed.data);

    return NextResponse.json({
      job,
      downloadUrl: `/api/projects/${projectId}/export-jobs/${job.id}/download`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "EXPORT_JOB_FAILED",
      },
      { status: 500 },
    );
  }
}
