import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { buildRedirectUrl } from "@/lib/http/redirect";
import { getLatestGenerationJobForUser } from "@/lib/mv/workflow";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(
      buildRedirectUrl(
        request,
        `/interfaces/login?error=${encodeURIComponent("请先登录后继续")}`,
      ),
    );
  }

  const { projectId } = await params;
  const snapshot = await getLatestGenerationJobForUser(user.id, projectId);

  if (snapshot?.job.status !== "completed") {
    return NextResponse.redirect(
      buildRedirectUrl(
        request,
        `/interfaces/generation?projectId=${projectId}&message=generation-processing`,
      ),
    );
  }

  return NextResponse.redirect(
    buildRedirectUrl(
      request,
      `/interfaces/export?projectId=${projectId}&message=export-ready`,
    ),
  );
}
