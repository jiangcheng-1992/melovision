import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PricingBillingToggle } from "@/components/interfaces/pricing-billing-toggle";
import { PublicTopbar } from "@/components/site/public-topbar";
import { getCurrentUser } from "@/lib/auth/session";
import { CREDIT_COST_CATALOG, PLAN_CATALOG } from "@/lib/billing/catalog";
import { getBillingOverviewForUser } from "@/lib/billing/service";

export const metadata: Metadata = {
  title: "价格方案 - MeloVision",
  description: "MeloVision 定价页",
};

const faqs = [
  {
    question: "什么是积分？",
    answer:
      "积分是 MeloVision AI 的基础货币。不同的生成任务，如生成音乐、生成视频、重新生成分镜等，会消耗不同数量的积分。积分每月重置。",
  },
  {
    question: "我可以随时取消吗？",
    answer:
      "可以，您可以随时在账户设置中取消订阅。取消后，您在当前计费周期结束前仍可继续使用高级功能，周期结束后将自动降级为入门版。",
  },
  {
    question: "我拥有生成的音乐版权吗？",
    answer:
      "使用专业版生成的音乐和视频，您拥有完整的商业使用权。入门版和创作者版生成的作品仅限非商业用途。",
  },
  {
    question: "支持哪些支付方式？",
    answer:
      "我们支持主流的信用卡、PayPal 以及部分地区的本地支付方式。企业方案支持银行转账。",
  },
  {
    question: "我可以升级或降级方案吗？",
    answer:
      "可以。升级方案会立即生效并按比例收取差价；降级方案将在当前计费周期结束后生效。",
  },
];

export default async function PricingPage() {
  const currentUser = await getCurrentUser();
  const overview = currentUser
    ? await getBillingOverviewForUser(currentUser.id)
    : null;
  const plans = overview?.plans ?? PLAN_CATALOG;
  const creditCosts = overview?.creditCosts ?? CREDIT_COST_CATALOG;
  const pricingState = {
    authenticated: Boolean(currentUser),
    plans,
    creditCosts,
    recentTransactions:
      overview?.recentTransactions.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
      })) ?? [],
    summary: overview?.summary
      ? {
          ...overview.summary,
          periodStartedAt: overview.summary.periodStartedAt.toISOString(),
          periodEndsAt: overview.summary.periodEndsAt?.toISOString() ?? null,
        }
      : null,
  };

  return (
    <div className="relative min-h-screen bg-[#14121f] font-sans text-[#e5e0f3] antialiased">
      <div className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg_viewBox=%220_0_200_200%22_xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter_id=%22noiseFilter%22%3E%3CfeTurbulence_type=%22fractalNoise%22_baseFrequency=%220.65%22_numOctaves=%223%22_stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect_width=%22100%25%22_height=%22100%25%22_filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      <PublicTopbar activeNav="pricing" sourcePage="pricing" />

      <main className="mx-auto max-w-[1200px] px-6 pt-28 pb-24">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
            简单透明的定价方案
          </h1>
          <p className="mb-8 text-xl text-[#ccc3d8]">
            免费开始使用。需要更多功能时随时升级。
          </p>
        </div>

        <Suspense
          fallback={
            <div className="mb-16 rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-8 text-center text-[#ccc3d8]">
              正在加载价格方案...
            </div>
          }
        >
          <PricingBillingToggle initialState={pricingState} />
        </Suspense>

        <div className="my-16 h-px w-full bg-gradient-to-r from-[#d2bbff] via-transparent to-[#4cd7f6] opacity-30" />

        <div className="mb-16 flex flex-col items-center justify-between rounded-2xl border border-[#4a4455]/10 bg-[#1c1a27] p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.2)] md:flex-row md:text-left">
          <div className="mb-6 md:mb-0">
            <h4 className="mb-2 text-2xl font-bold">
              需要更多？联系我们获取企业方案
            </h4>
            <p className="text-sm text-[#ccc3d8]">
              定制积分包、专属客户成功经理、私有化部署支持。
            </p>
          </div>
          <a
            href="mailto:sales@melovision.ai?subject=MeloVision%20Enterprise"
            className="group flex items-center gap-2 rounded-lg border border-[#4a4455]/30 px-6 py-3 font-medium text-[#e5e0f3] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#363342]"
          >
            联系销售
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-[#d2bbff] via-transparent to-[#4cd7f6] opacity-30" />

        <div className="mb-16">
          <h3 className="mb-10 text-center text-2xl font-bold">积分消耗一览</h3>
          <div className="overflow-x-auto rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19]">
            <table className="w-full text-left">
              <thead className="bg-[#1c1a27] text-sm uppercase tracking-wider text-[#ccc3d8]">
                <tr>
                  <th className="border-b border-[#4a4455]/10 px-6 py-4 font-medium">
                    创作行为
                  </th>
                  <th className="border-b border-[#4a4455]/10 px-6 py-4 text-right font-medium">
                    积分消耗
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#4a4455]/10 text-[#e5e0f3]">
                {creditCosts.map((item) => (
                  <tr
                    key={item.action}
                    className="transition-colors hover:bg-[#1c1a27]/50"
                  >
                    <td className="px-6 py-4">{item.action}</td>
                    <td
                      className={`px-6 py-4 text-right font-bold ${
                        item.free ? "text-[#ccc3d8]" : "text-[#4cd7f6]"
                      }`}
                    >
                      {item.free ? "免费" : `${item.cost} 积分`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="my-16 h-px w-full bg-gradient-to-r from-[#d2bbff] via-transparent to-[#4cd7f6] opacity-30" />

        <div className="mx-auto mb-24 max-w-3xl">
          <h3 className="mb-10 text-center text-2xl font-bold">常见问题解答</h3>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19] p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-2 font-bold text-[#e5e0f3]">
                  <h4 className="text-lg">{faq.question}</h4>
                  <span className="shrink-0 rounded-full bg-[#1c1a27] p-1.5 text-[#ccc3d8] group-open:bg-[#7c3aed] group-open:text-[#ede0ff]">
                    <ChevronDown className="size-5 transition duration-300 group-open:-rotate-180" />
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-[#ccc3d8]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-20 w-full rounded-t-3xl border-t border-[#4a4455]/20 bg-[#0e0c19]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-10 py-16 text-sm md:grid-cols-4">
          <div className="md:col-span-1">
            <span className="mb-4 block text-xl font-black text-[#d2bbff]">
              MeloVision
            </span>
            <p className="mt-2 text-[#ccc3d8]/70">
              Built for the synesthetic canvas.
            </p>
            <p className="mt-4 text-[#ccc3d8]/70">
              © 2024 MeloVision. All rights reserved.
            </p>
          </div>
          <div className="md:col-span-3 md:justify-end">
            <div className="flex flex-wrap gap-8 md:justify-end">
              <div className="flex flex-col gap-4">
                <Link
                  className="text-[#ccc3d8]/70 transition-all hover:translate-x-1 hover:text-[#4cd7f6]"
                  href="/"
                >
                  Product
                </Link>
                <Link
                  className="text-[#ccc3d8]/70 transition-all hover:translate-x-1 hover:text-[#4cd7f6]"
                  href="/interfaces"
                >
                  API Docs
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  className="text-[#ccc3d8]/70 transition-all hover:translate-x-1 hover:text-[#4cd7f6]"
                  href="/interfaces/privacy"
                >
                  Privacy Policy
                </Link>
                <Link
                  className="text-[#ccc3d8]/70 transition-all hover:translate-x-1 hover:text-[#4cd7f6]"
                  href="/interfaces/terms"
                >
                  Terms of Service
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <Link
                  className="text-[#ccc3d8]/70 transition-all hover:translate-x-1 hover:text-[#4cd7f6]"
                  href="/interfaces/login"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
