import type { Metadata } from "next";
import { WorkbenchStudio } from "@/components/interfaces/workbench-studio";
import { requireCurrentUser } from "@/lib/auth/session";
import { getCreditBadgeLabelForUser } from "@/lib/billing/service";
import { getProjectForUser } from "@/lib/mv/workflow";

export const dynamic = "force-dynamic";

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

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const creditsLabel = await getCreditBadgeLabelForUser(user.id);

  try {
    const project = await getProjectForUser(user.id, projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    return <WorkbenchStudio project={project} projectId={projectId} creditsLabel={creditsLabel} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : "WORKBENCH_LOAD_FAILED";
    console.error("[workbench] page_load_failed", { projectId, message });

    return (
      <div className="min-h-screen bg-[#14121f] p-6 text-[#e5e0f3]">
        <div className="mx-auto mt-20 max-w-3xl rounded-2xl border border-[#4a4455]/20 bg-[#1c1a27] p-6">
          <h1 className="text-xl font-semibold">分镜页面暂时不可用</h1>
          <p className="mt-3 text-sm text-[#ccc3d8]">
            系统正在处理中，请稍后刷新重试。若持续失败，请把当前时间和项目链接发我，我继续排查。
          </p>
          <p className="mt-4 text-xs text-[#958da1]">错误信息：{message}</p>
        </div>
      </div>
    );
  }
}
