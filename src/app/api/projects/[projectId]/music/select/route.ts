import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { buildRedirectUrl } from "@/lib/http/redirect";
import { selectMusicOption } from "@/lib/mv/workflow";

const selectSchema = z.object({
  optionId: z.string().min(1),
});

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
  const formData = await request.formData();
  const parsed = selectSchema.safeParse({
    optionId: formData.get("optionId"),
  });

  if (!parsed.success) {
    return NextResponse.redirect(
      buildRedirectUrl(
        request,
        `/interfaces/music?projectId=${projectId}&error=${encodeURIComponent("音乐选择无效")}`,
      ),
    );
  }

  await selectMusicOption(user.id, projectId, parsed.data.optionId);

  return NextResponse.redirect(
    buildRedirectUrl(
      request,
      `/interfaces/music?projectId=${projectId}&message=music-selected`,
    ),
  );
}
