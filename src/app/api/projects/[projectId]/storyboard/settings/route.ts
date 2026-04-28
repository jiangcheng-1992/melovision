import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/session";
import { updateStoryboardSettings } from "@/lib/mv/workflow";

const settingsSchema = z.object({
  styleTags: z.array(z.string().trim().min(1)).max(20),
  consistencyBoost: z.boolean(),
  transitionStyle: z.string().trim().min(1).max(100),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const { projectId } = await params;
  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "INVALID_STORYBOARD_SETTINGS", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const settings = await updateStoryboardSettings(user.id, projectId, parsed.data);
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "STORYBOARD_SETTINGS_SAVE_FAILED" },
      { status: 500 },
    );
  }
}
