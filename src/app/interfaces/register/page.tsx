import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Mail, Music4, User } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PasswordInput } from "@/components/auth/password-input";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "MeloVision - 注册",
  description: "MeloVision register page",
};

function SocialButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled
      className="flex cursor-not-allowed items-center justify-center rounded-lg border border-[#4a4455]/20 bg-[#1c1a27] px-4 py-3 opacity-50 md:py-2.5"
    >
      {children}
    </button>
  );
}

function getErrorMessage(error?: string) {
  if (!error) return null;
  return error;
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/interfaces/projects");
  }

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);

  return (
    <div className="min-h-screen overflow-hidden bg-[#14121f] text-[#e5e0f3] antialiased selection:bg-[#7c3aed] selection:text-[#ede0ff] md:flex md:overflow-auto">
      <section className="relative flex h-40 w-full shrink-0 flex-col justify-center overflow-hidden bg-[#0e0c19] p-6 md:h-auto md:w-5/12 md:justify-between md:p-12 lg:w-1/2">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#7c3aed]/20 via-[#0e0c19] to-[#03b5d3]/10" />
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#7c3aed]/30 blur-[100px]" />
          <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-[#03b5d3]/20 blur-[100px]" />
          <img
            alt="Abstract Background"
            className="absolute inset-0 h-full w-full object-cover opacity-30 mix-blend-overlay"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaal9UU4z8tBsNH4cgTOdsoWK97mb17fQUNrPl4MkqvRP_fMEN1SBEGRBL_7ZEREsIcDwbsNiSl_XBU4z72dK1CBkft4FVZFt0KITi0EHju2QYHhoid66uf2GfeP4Wktsoge9HuA8NbGyLL3sYUdz7FdoPAAv5uIk4opOCHapGB3l8cDYOd4omb5SAMbbibNRMR3lVqOHts6rfczNLo1-FKDYyF9tVCrH81W2XSJbwH7Z0hTVX8YzYs5Fjiomgiz5vj6Qov_bJlw"
          />
        </div>

        <Link
          href="/"
          className="relative z-10 flex items-center justify-center gap-3 md:justify-start"
        >
          <Music4 className="h-9 w-9 text-[#d2bbff]" />
          <span className="font-display bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6] bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
            MeloVision
          </span>
        </Link>

        <div className="relative z-10 hidden max-w-md md:block">
          <h1 className="font-display mb-6 text-4xl font-bold leading-tight md:text-4xl lg:text-5xl">
            听见色彩
            <br />
            <span className="bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6] bg-clip-text text-transparent">
              看见声音
            </span>
          </h1>
          <p className="text-lg leading-relaxed text-[#ccc3d8]">
            加入我们的突触画板，在这里，您的音乐节奏将转化为令人惊叹的视觉动效。突破传统模板的界限。
          </p>
          <div className="mt-8 flex gap-2">
            <div className="h-1 w-8 rounded-full bg-[#d2bbff]" />
            <div className="h-1 w-4 rounded-full bg-[#363342]" />
            <div className="h-1 w-2 rounded-full bg-[#363342]" />
          </div>
        </div>

        <div className="relative z-10 hidden max-w-md rounded-xl border border-[#4a4455]/20 bg-[#363342]/40 p-6 backdrop-blur-md md:block">
          <p className="mb-4 text-sm italic text-[#ccc3d8]">
            "MeloVision 完全改变了我们构思音乐视频的方式。它感觉就像拥有了一个懂通感的 AI 联合导演。"
          </p>
          <div className="flex items-center gap-3">
            <img
              alt="Elena R."
              className="h-10 w-10 rounded-full border border-[#4a4455]/30 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrxwB3wDW0ZFIYv6I-NDIeF2f6ikCLvpP10B7gzNUWeaIbW-VD8uTPzIWoTA3WfzBq19vkpFRur3CnweCwcbEoSpr05O6MNm83XVu3rcokvyQLpwfZoCSG_LCxwuumFjFQLBo-kBeQTHAdo3ovPmhPpSu00L0rx-LsW2SE6EDFzGvFupRiQTjJGNHwHBkFurAudgCu3fPahqTLR6LXjqSj7KvpwcHIFoKcEqJ_0og10lBARZnQTmNlN_TYCIu-yMkk3C97PbmhWA"
            />
            <div>
              <div className="text-sm font-semibold text-[#e5e0f3]">Elena R.</div>
              <div className="text-xs text-[#ccc3d8]">视觉艺术家</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex w-full flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="absolute inset-0 z-0 bg-[#14121f] md:hidden">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-[#7c3aed]/20 blur-[80px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="rounded-xl border border-[#4a4455]/20 bg-[#363342]/60 p-6 shadow-[0_20px_40px_rgba(20,18,31,0.5)] backdrop-blur-xl sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="font-display mb-2 text-2xl font-bold text-[#e5e0f3]">
                创建您的账号
              </h2>
              <p className="text-sm text-[#ccc3d8]">免费开启 AI 音乐视频创作</p>
            </div>

            {errorMessage ? (
              <div className="mb-5 rounded-lg border border-[#ffb4ab]/20 bg-[#93000a]/10 px-4 py-3 text-sm text-[#ffd2cc]">
                {errorMessage}
              </div>
            ) : null}

            <form action="/api/auth/register" className="space-y-5" method="POST">
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#ccc3d8]"
                  htmlFor="displayName"
                >
                  显示名称
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#958da1]">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    placeholder="输入您的昵称"
                    required
                    className="block w-full rounded-lg border border-[#4a4455]/30 bg-[#0e0c19] py-3 pl-10 text-base text-[#e5e0f3] placeholder:text-[#958da1] transition-colors focus:border-[#d2bbff]/50 focus:ring-1 focus:ring-[#d2bbff]/50 md:py-2.5 md:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#ccc3d8]"
                  htmlFor="email"
                >
                  电子邮箱
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#958da1]">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="block w-full rounded-lg border border-[#4a4455]/30 bg-[#0e0c19] py-3 pl-10 text-base text-[#e5e0f3] placeholder:text-[#958da1] transition-colors focus:border-[#d2bbff]/50 focus:ring-1 focus:ring-[#d2bbff]/50 md:py-2.5 md:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-[#ccc3d8]"
                  htmlFor="password"
                >
                  密码
                </label>
                <PasswordInput
                  id="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  wrapperClassName="relative mb-2"
                  inputClassName="block w-full rounded-lg border border-[#4a4455]/30 bg-[#0e0c19] py-3 pl-10 pr-10 text-base text-[#e5e0f3] placeholder:text-[#958da1] transition-colors focus:border-[#d2bbff]/50 focus:ring-1 focus:ring-[#d2bbff]/50 md:py-2.5 md:text-sm"
                  iconClassName="h-5 w-5"
                  toggleButtonClassName="absolute inset-y-0 right-0 flex items-center pr-3 text-[#958da1] transition-colors hover:text-[#d2bbff]"
                />

                <div className="mt-2 flex h-1.5 gap-1">
                  <div className="flex-1 rounded-full bg-[#ffb4ab] opacity-50" />
                  <div className="flex-1 rounded-full bg-[#363342]" />
                  <div className="flex-1 rounded-full bg-[#363342]" />
                </div>
                <p className="mt-1 text-right text-xs text-[#958da1]">密码强度：弱</p>
              </div>

              <div className="flex items-start pt-2">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-5 w-5 rounded border-[#4a4455] bg-[#0e0c19] text-[#7c3aed] focus:ring-[#d2bbff]/50 focus:ring-offset-2 focus:ring-offset-[#363342] md:h-4 md:w-4"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-[#ccc3d8]" htmlFor="terms">
                    我已阅读并同意{" "}
                    <Link
                      className="text-[#4cd7f6] underline-offset-2 hover:underline"
                      href="/interfaces/terms"
                    >
                      服务条款
                    </Link>{" "}
                    和{" "}
                    <Link
                      className="text-[#4cd7f6] underline-offset-2 hover:underline"
                      href="/interfaces/privacy"
                    >
                      隐私政策
                    </Link>
                  </label>
                </div>
              </div>

              <AuthSubmitButton
                idleLabel="创建账号"
                pendingLabel="注册中..."
                className="mt-6 flex w-full justify-center rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-4 py-3.5 text-base font-medium text-[#ede0ff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(210,187,255,0.3)] active:scale-[0.98] md:py-3"
              />
            </form>

            <div className="relative mt-8 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4a4455]/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-[#363342] px-2 text-[#958da1]">
                  第三方注册即将开放
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SocialButton label="Google 注册">
                <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </SocialButton>

              <SocialButton label="GitHub 注册">
                <svg
                  className="h-5 w-5 text-[#e5e0f3]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              </SocialButton>

              <SocialButton label="Apple 注册">
                <svg
                  className="h-5 w-5 text-[#e5e0f3]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16.365 7.143c-.021-2.022 1.636-3.178 1.724-3.232-1.027-1.503-2.616-1.708-3.178-1.73-1.354-.136-2.645.795-3.332.795-.688 0-1.758-.773-2.883-.75-1.468.021-2.822.853-3.58 2.164-1.528 2.651-.39 6.574 1.107 8.739.73 1.05 1.59 2.227 2.73 2.186 1.1-.043 1.523-.709 2.852-.709 1.328 0 1.71.71 2.853.688 1.185-.022 1.932-1.071 2.656-2.128.84-1.226 1.188-2.415 1.206-2.478-.027-.01-2.324-.892-2.34-3.545h.185zM14.28 4.316c.616-.745 1.031-1.78 1.031-2.815 0-.116-.011-.231-.032-.344-.94.043-2.043.631-2.683 1.383-.564.654-1.053 1.704-.902 2.732.127.011.254.021.36.021.848 0 1.635-.246 2.226-.977z" />
                </svg>
              </SocialButton>
            </div>

            <p className="mt-8 text-center text-sm text-[#ccc3d8]">
              已有账号？{" "}
              <Link
                href="/interfaces/login"
                className="font-medium text-[#d2bbff] transition-colors hover:text-[#eaddff]"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
