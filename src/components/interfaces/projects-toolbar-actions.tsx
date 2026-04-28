"use client";

import { useState } from "react";
import { Bell, CircleHelp, LogOut, X } from "lucide-react";
import { HeaderAvatar } from "@/components/site/header-primitives";

type ProjectsToolbarActionsProps = {
  displayName: string;
};

export function ProjectsToolbarActions({
  displayName,
}: ProjectsToolbarActionsProps) {
  const [panel, setPanel] = useState<"notifications" | "help" | null>(null);

  return (
    <div className="relative hidden items-center gap-3 sm:flex">
      <button
        type="button"
        onClick={() =>
          setPanel((current) => (current === "notifications" ? null : "notifications"))
        }
        className="text-[#a9a2ba] transition-colors hover:text-[#f5f3ff]"
      >
        <Bell className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => setPanel((current) => (current === "help" ? null : "help"))}
        className="text-[#a9a2ba] transition-colors hover:text-[#f5f3ff]"
      >
        <CircleHelp className="h-5 w-5" />
      </button>
      <form action="/api/auth/logout" method="POST">
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-full border border-[#4a4455]/20 bg-[#201e2c]/80 px-3 py-1.5 text-sm text-[#d7d2e5] transition-colors hover:bg-[#2b2836]"
        >
          <LogOut className="h-4 w-4" />
          退出
        </button>
      </form>
      <HeaderAvatar label={displayName.slice(0, 1).toUpperCase()} />

      {panel ? (
        <div className="absolute top-12 right-0 z-20 w-80 rounded-2xl border border-[#4a4455]/20 bg-[#1c1a27]/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#e5e0f3]">
              {panel === "notifications" ? "通知中心" : "帮助入口"}
            </h3>
            <button
              type="button"
              onClick={() => setPanel(null)}
              className="text-[#958da1] transition-colors hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {panel === "notifications" ? (
            <div className="space-y-3 text-sm text-[#ccc3d8]">
              <div className="rounded-xl border border-[#4cd7f6]/20 bg-[#062230] p-3 text-[#b6eeff]">
                你的最新项目、生成进度和导出完成提醒会在这里集中显示。
              </div>
              <div className="rounded-xl border border-[#4a4455]/20 bg-[#201e2c] p-3">
                当前暂无未读通知，继续创建新的 MV 吧。
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-[#ccc3d8]">
              <a
                href="/interfaces/pricing"
                className="block rounded-xl border border-[#4a4455]/20 bg-[#201e2c] p-3 transition-colors hover:bg-[#2b2836]"
              >
                查看积分与套餐说明
              </a>
              <a
                href="/interfaces/terms"
                className="block rounded-xl border border-[#4a4455]/20 bg-[#201e2c] p-3 transition-colors hover:bg-[#2b2836]"
              >
                阅读服务条款与使用边界
              </a>
              <a
                href="/interfaces/create"
                className="block rounded-xl border border-[#4a4455]/20 bg-[#201e2c] p-3 transition-colors hover:bg-[#2b2836]"
              >
                返回工作台继续创作
              </a>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
