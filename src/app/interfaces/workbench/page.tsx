import type { Metadata } from "next";
import { WorkbenchStudio } from "@/components/interfaces/workbench-studio";
import { requireCurrentUser } from "@/lib/auth/session";
import { getCreditBadgeLabelForUser } from "@/lib/billing/service";
import { getProjectForUser, ensureStoryboardScenes } from "@/lib/mv/workflow";

export const metadata: Metadata = {
  title: "分镜工作台 - MeloVision",
  description: "MeloVision MV 分镜工作台",
};

export default async function WorkbenchPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const user = await requireCurrentUser();
  const params = await searchParams;
  const projectId = params.projectId;
  const creditsLabel = await getCreditBadgeLabelForUser(user.id);

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  // 确保分镜已生成
  await ensureStoryboardScenes(user.id, projectId);
  
  const project = await getProjectForUser(user.id, projectId);
  
  if (!project) {
    throw new Error("Project not found");
  }

  return <WorkbenchStudio project={project} projectId={projectId} creditsLabel={creditsLabel} />;
}
