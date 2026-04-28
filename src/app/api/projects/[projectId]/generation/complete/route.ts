import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { getLatestGenerationJobForUser } from "@/lib/mv/workflow";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(
      new URL(
        `/interfaces/login?error=${encodeURIComponent("请先登录后继续")}`,
        request.url,
      ),
    );
  }

  const { projectId } = await params;
  const snapshot = await getLatestGenerationJobForUser(user.id, projectId);

  if (snapshot?.job.status !== "completed") {
    return NextResponse.redirect(
      new URL(`/interfaces/generation?projectId=${projectId}&message=generation-processing`, request.url),
    );
  }

  return NextResponse.redirect(
    new URL(`/interfaces/export?projectId=${projectId}&message=export-ready`, request.url),
  );
}
