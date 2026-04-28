import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/session";
import { regenerateMusicOptions } from "@/lib/mv/workflow";

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

  const result = await regenerateMusicOptions(user.id, projectId);

  const redirectUrl = new URL(
    `/interfaces/music?projectId=${projectId}&message=music-regenerated`,
    request.url,
  );
  if (result.warningCode) {
    redirectUrl.searchParams.set("warning", result.warningCode);
  }

  return NextResponse.redirect(redirectUrl);
}
