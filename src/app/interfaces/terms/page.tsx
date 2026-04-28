import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "服务条款 - MeloVision",
  description: "MeloVision terms page",
};

const sections = [
  {
    title: "服务说明",
    content:
      "MeloVision 提供 AI 音乐视频生成、创意编辑和导出能力。当前站点中的页面主要用于展示产品流程和交互原型。",
  },
  {
    title: "账号使用",
    content:
      "你需要对账号下发起的操作负责，不得将平台用于违法、侵权或恶意生成内容的场景。",
  },
  {
    title: "内容与版权",
    content:
      "请确保你上传或输入的素材、歌词、音频与文案具备合法使用权。平台生成结果的实际商业使用需遵循后续正式产品条款。",
  },
  {
    title: "服务变更",
    content:
      "我们可能会持续调整功能、额度、价格和可用性，以匹配产品演进与服务稳定性需求。",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#14121f] px-6 py-12 text-[#e5e0f3]">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/interfaces/register"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#ccc3d8] transition-colors hover:text-[#d2bbff]"
        >
          <ArrowLeft className="h-4 w-4" />
          返回注册
        </Link>

        <div className="rounded-3xl border border-[#4a4455]/20 bg-[#0e0c19]/80 p-8 shadow-[0_24px_64px_-12px_rgba(229,224,243,0.04)] backdrop-blur-[24px]">
          <h1 className="font-display mb-3 text-4xl font-bold text-white">服务条款</h1>
          <p className="mb-10 text-sm leading-6 text-[#ccc3d8]">
            最后更新：2026-04-23
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-xl font-semibold text-[#d2bbff]">
                  {section.title}
                </h2>
                <p className="leading-7 text-[#ccc3d8]">{section.content}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
