import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "隐私政策 - MeloVision",
  description: "MeloVision privacy page",
};

const sections = [
  {
    title: "我们收集的信息",
    content:
      "当你注册、登录或填写创作表单时，我们可能会收集邮箱、昵称、项目描述、偏好设置以及交互行为等信息。",
  },
  {
    title: "信息用途",
    content:
      "这些信息主要用于账号识别、产品体验优化、功能分析和后续创作流程的个性化推荐。",
  },
  {
    title: "数据安全",
    content:
      "我们会采取合理的技术与管理措施保护你的数据，但任何网络传输都无法保证绝对安全。",
  },
  {
    title: "联系与更新",
    content:
      "若隐私政策发生调整，我们会在产品内更新说明。若你有数据相关问题，可通过正式支持渠道联系我们。",
  },
];

export default function PrivacyPage() {
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
          <h1 className="font-display mb-3 text-4xl font-bold text-white">隐私政策</h1>
          <p className="mb-10 text-sm leading-6 text-[#ccc3d8]">
            最后更新：2026-04-23
          </p>

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="mb-3 text-xl font-semibold text-[#4cd7f6]">
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
