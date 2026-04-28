import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getExportJobForUser } from "@/lib/mv/workflow";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; jobId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId, jobId } = await params;
  const job = await getExportJobForUser(user.id, projectId, jobId);

  if (!job) {
    return NextResponse.json({ error: "EXPORT_JOB_NOT_FOUND" }, { status: 404 });
  }

  if (job.status !== "completed" || !job.outputContent || !job.fileName) {
    return NextResponse.json(
      { error: "EXPORT_JOB_NOT_READY", status: job.status },
      { status: 409 },
    );
  }

  if (
    (job.outputMimeType || "").startsWith("video/") &&
    /^https?:\/\//i.test(job.outputContent)
  ) {
    const upstream = await fetch(job.outputContent, {
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "EXPORT_VIDEO_FETCH_FAILED", status: upstream.status },
        { status: 502 },
      );
    }

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || job.outputMimeType || "video/mp4",
        "Content-Disposition": `attachment; filename="${job.fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  }

  return new NextResponse(job.outputContent, {
    status: 200,
    headers: {
      "Content-Type": job.outputMimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${job.fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
