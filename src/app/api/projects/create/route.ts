import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { buildRedirectUrl } from "@/lib/http/redirect";
import { saveProjectDraftWithMusic } from "@/lib/mv/workflow";

const createProjectSchema = z.object({
  projectId: z.string().trim().optional(),
  title: z.string().trim().min(1, "请先填写 MV 标题").max(80),
  conceptPrompt: z.string().trim().min(10, "请至少填写 10 个字的创意描述").max(1000),
  customLyrics: z.string().trim().max(2000).optional(),
  musicGenerationMode: z.enum(["song", "instrumental"]).optional(),
  visualStyle: z.string().trim().min(1, "请选择视觉风格"),
  musicStyle: z.string().trim().min(1, "请选择音乐风格"),
  aspectRatio: z.string().trim().optional(),
  shotDensity: z.string().trim().optional(),
  performanceMode: z.string().trim().optional(),
  subtitleMode: z.string().trim().optional(),
  consistencyBoost: z.enum(["true", "false"]).optional(),
});

function redirectWithError(request: Request, error: string, projectId?: string) {
  return NextResponse.redirect(
    buildRedirectUrl(
      request,
      `/interfaces/create?error=${encodeURIComponent(error)}${projectId ? `&projectId=${encodeURIComponent(projectId)}` : ""}`,
    ),
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(
      buildRedirectUrl(
        request,
        `/interfaces/login?error=${encodeURIComponent("请先登录后继续")}`,
      ),
    );
  }

  const formData = await request.formData();
  const submittedProjectId = (formData.get("projectId") || undefined)?.toString();
  const parsed = createProjectSchema.safeParse({
    projectId: formData.get("projectId") || undefined,
    title: formData.get("title"),
    conceptPrompt: formData.get("conceptPrompt"),
    customLyrics: formData.get("customLyrics") || undefined,
    musicGenerationMode: formData.get("musicGenerationMode") || undefined,
    visualStyle: formData.get("visualStyle"),
    musicStyle: formData.get("musicStyle"),
    aspectRatio: formData.get("aspectRatio") || undefined,
    shotDensity: formData.get("shotDensity") || undefined,
    performanceMode: formData.get("performanceMode") || undefined,
    subtitleMode: formData.get("subtitleMode") || undefined,
    consistencyBoost: formData.get("consistencyBoost") || undefined,
  });

  if (!parsed.success) {
    return redirectWithError(
      request,
      parsed.error.issues[0]?.message ?? "创建项目失败",
      submittedProjectId,
    );
  }

  const { projectId, ...projectInput } = parsed.data;
  const result = await saveProjectDraftWithMusic(
    user.id,
    {
      ...projectInput,
      consistencyBoost: parsed.data.consistencyBoost === "true",
    },
    projectId,
  );

  const redirectUrl = buildRedirectUrl(
    request,
    `/interfaces/music?projectId=${result.projectId}&created=1`,
  );
  if (result.warningCode) {
    redirectUrl.searchParams.set("warning", result.warningCode);
  }

  return NextResponse.redirect(redirectUrl);
}
