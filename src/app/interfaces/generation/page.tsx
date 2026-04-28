import type { Metadata } from "next";
import { GenerationProgressPanel } from "@/components/interfaces/generation-progress-panel";
import { requireCurrentUser } from "@/lib/auth/session";
import { getCreditBadgeLabelForUser } from "@/lib/billing/service";
import { getOrStartGenerationJobForUser } from "@/lib/mv/workflow";

export const metadata: Metadata = {
  title: "生成中 - MeloVision",
  description: "MeloVision generation progress page",
};

export default async function GenerationPage({
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

  const snapshot = await getOrStartGenerationJobForUser(user.id, projectId);

  return (
    <GenerationProgressPanel
      initialSnapshot={snapshot}
      projectId={projectId}
      creditsLabel={creditsLabel}
    />
  );
}
