import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { PublicTopbar } from "@/components/site/public-topbar";

export const metadata: Metadata = {
  title: "找回密码 - MeloVision",
  description: "MeloVision forgot password page",
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#14121f] px-6 py-12 pt-24 text-[#e5e0f3]">
      <PublicTopbar variant="login" sourcePage="forgot-password" />
      <div className="w-full max-w-md rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19]/80 p-8 shadow-[0_24px_64px_-12px_rgba(229,224,243,0.04)] backdrop-blur-[24px]">
        <Link
          href="/interfaces/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#ccc3d8] transition-colors hover:text-[#d2bbff]"
        >
          <ArrowLeft className="h-4 w-4" />
          返回登录
        </Link>

        <h1 className="font-display mb-3 text-3xl font-bold text-white">找回密码</h1>
        <p className="mb-8 text-sm leading-6 text-[#ccc3d8]">
          输入注册邮箱，我们会向你发送重置密码的链接。
        </p>

        <form action="/interfaces/login" className="space-y-5" method="GET">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#e5e0f3]" htmlFor="email">
              电子邮箱
            </label>
            <div className="group relative rounded-lg border border-[#4a4455]/30 bg-[#201e2c] transition-all duration-200 focus-within:border-[#d2bbff]/50 focus-within:shadow-[inset_0_0_0_1px_rgba(210,187,255,0.5),0_0_20px_0_rgba(210,187,255,0.15)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-[#958da1] transition-colors group-focus-within:text-[#d2bbff]" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-lg bg-transparent py-3 pl-10 pr-4 text-[#e5e0f3] placeholder:text-[#958da1]/70 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-4 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_0_20px_rgba(210,187,255,0.3)]"
          >
            发送重置链接
          </button>
        </form>
      </div>
    </div>
  );
}
