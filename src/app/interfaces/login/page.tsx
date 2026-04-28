import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Mail, PlayCircle } from "lucide-react";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { PasswordInput } from "@/components/auth/password-input";
import { PublicTopbar } from "@/components/site/public-topbar";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "MeloVision - 登录",
  description: "MeloVision login page",
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
      className="group flex cursor-not-allowed items-center justify-center rounded-lg border border-[#4a4455]/20 bg-[#201e2c] py-3 opacity-50 sm:py-2.5"
    >
      {children}
    </button>
  );
}

function getErrorMessage(error?: string) {
  if (!error) return null;
  return error;
}

function getNoticeMessage(message?: string) {
  if (message === "logged-out") {
    return "已安全退出登录";
  }

  return null;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/interfaces/projects");
  }

  const params = await searchParams;
  const errorMessage = getErrorMessage(params.error);
  const noticeMessage = getNoticeMessage(params.message);

  return (
    <div className="min-h-screen bg-[#14121f] text-[#e5e0f3] antialiased selection:bg-[#7c3aed]/30 selection:text-[#d2bbff] md:flex">
      <PublicTopbar variant="login" sourcePage="login" />
      <section className="relative flex w-full flex-col justify-center overflow-hidden bg-gradient-to-br from-[#7c3aed] via-[#3f008e] to-[#001f26] px-6 py-10 md:w-5/12 md:justify-between md:p-10 lg:w-1/2 lg:p-20">
        <div className="absolute top-[-10%] left-[-10%] h-96 w-96 rounded-full bg-[#4cd7f6] opacity-20 blur-[120px]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-[#aa4900] opacity-20 blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <Link
          href="/"
          className="relative z-10 mt-16 flex items-center justify-center gap-3 md:mt-10 md:justify-start"
        >
          <PlayCircle className="h-10 w-10 fill-current text-[#d2bbff]" />
          <h1 className="font-display bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6] bg-clip-text text-3xl font-bold tracking-tighter text-transparent">
            MeloVision
          </h1>
        </Link>

        <div className="relative z-10 my-auto hidden pt-20 pb-10 md:block">
          <h2 className="font-display mb-6 text-4xl font-extrabold leading-tight tracking-tighter text-white lg:text-6xl xl:text-7xl">
            从灵感到
            <br />
            音乐 MV，
            <br />
            <span className="bg-gradient-to-r from-[#4cd7f6] to-[#d2bbff] bg-clip-text text-transparent">
              仅需数分钟
            </span>
          </h2>
          <p className="max-w-md text-lg font-light leading-relaxed text-[#ede0ff] lg:text-xl">
            利用人工智能将您的音频转化为视觉震撼的动态影片。探索通感创作的未来。
          </p>
        </div>

        <div className="relative z-10 hidden md:block">
          <div className="max-w-md rounded-xl border border-[#4a4455]/20 bg-[rgba(54,51,66,0.6)] p-4 backdrop-blur-[24px] transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <img
                  alt="Abstract neon fluid art"
                  className="h-full w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUIa2aheblh6oXaMIMkR2AMjclJC2wvuMrquD-l6D9VmbOueNMG57C_hddZWAj2wCEkCvGBuQD8OJWFZT_Yg8wQSBku-zJc-OtxRMk__gBfmrOsJ4cjMsrNOIv1rlSUaMFG8Z5bw_DG2zRj8i56GUBoAgagl6iu4C2Jfg6iEGqJhTjlv5E6Ln_A90cOHywm2BpTfiWtWR_TH0NsIH-5oLrwkgzNt1BaaiXBKwVMNVQfs2mGI3A8xr8gznn9wuq15kR6ZGo7NFm7Q"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircle className="h-6 w-6 fill-current text-white/80" />
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-1 truncate text-sm font-medium text-white">
                  Cyberpunk Reverie.mp4
                </p>
                <div className="flex items-center gap-2">
                  <span className="rounded border border-[#d2bbff]/20 bg-[#7c3aed]/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#d2bbff]">
                    由 MeloVision 创作
                  </span>
                  <span className="text-xs text-[#ccc3d8]">2:45</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[#363342]">
                  <div className="h-full w-2/3 bg-gradient-to-r from-[#d2bbff] to-[#4cd7f6]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative flex w-full items-center justify-center bg-[#14121f] p-6 sm:p-12 lg:w-1/2 lg:p-20">
        <div className="relative z-10 w-full max-w-md">
          <div className="mb-10 text-center md:text-left">
            <h2 className="font-display mb-3 text-3xl font-bold text-white md:text-4xl">
              欢迎回来
            </h2>
            <p className="text-sm text-[#ccc3d8] md:text-base">
              登录以继续您的创作之旅
            </p>
          </div>

          <div className="rounded-2xl border border-[#4a4455]/20 bg-[#0e0c19]/80 p-6 shadow-[0_24px_64px_-12px_rgba(229,224,243,0.04)] backdrop-blur-[24px] sm:p-8">
            {noticeMessage ? (
              <div className="mb-5 rounded-lg border border-[#4cd7f6]/20 bg-[#062230] px-4 py-3 text-sm text-[#b6eeff]">
                {noticeMessage}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="mb-5 rounded-lg border border-[#ffb4ab]/20 bg-[#93000a]/10 px-4 py-3 text-sm text-[#ffd2cc]">
                {errorMessage}
              </div>
            ) : null}

            <form action="/api/auth/login" className="space-y-5" method="POST">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-[#e5e0f3]" htmlFor="email">
                  电子邮箱
                </label>
                <div className="group relative rounded-lg border border-[#4a4455]/30 bg-[#201e2c] transition-all duration-200 focus-within:border-[#d2bbff]/50 focus-within:shadow-[inset_0_0_0_1px_rgba(210,187,255,0.5),0_0_20px_0_rgba(210,187,255,0.15)]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-[#958da1] transition-colors group-focus-within:text-[#d2bbff]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-lg bg-transparent py-3 pl-10 pr-4 text-[#e5e0f3] placeholder:text-[#958da1]/70 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="block text-sm font-medium text-[#e5e0f3]"
                    htmlFor="password"
                  >
                    密码
                  </label>
                  <Link
                    className="text-xs text-[#4cd7f6] transition-colors hover:text-[#d2bbff]"
                    href="/interfaces/forgot-password"
                  >
                    忘记密码？
                  </Link>
                </div>
                <PasswordInput
                  id="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  wrapperClassName="group relative rounded-lg border border-[#4a4455]/30 bg-[#201e2c] transition-all duration-200 focus-within:border-[#d2bbff]/50 focus-within:shadow-[inset_0_0_0_1px_rgba(210,187,255,0.5),0_0_20px_0_rgba(210,187,255,0.15)]"
                  inputClassName="w-full rounded-lg bg-transparent py-3 pl-10 pr-12 text-[#e5e0f3] placeholder:text-[#958da1]/70 outline-none"
                  iconClassName="h-5 w-5 text-[#958da1] transition-colors group-focus-within:text-[#d2bbff]"
                  toggleButtonClassName="absolute inset-y-0 right-0 flex items-center pr-3 text-[#958da1] transition-colors hover:text-[#e5e0f3]"
                />
              </div>

              <div className="pt-2">
                <AuthSubmitButton
                  idleLabel="登录"
                  pendingLabel="登录中..."
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-4 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_0_20px_rgba(210,187,255,0.3)]"
                  icon={<ArrowRight className="h-4 w-4" />}
                />
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-[#4a4455]/30" />
                <span className="mx-4 shrink-0 text-xs uppercase tracking-wider text-[#4a4455]">
                  第三方登录即将开放
                </span>
                <div className="flex-grow border-t border-[#4a4455]/30" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <SocialButton label="Google 登录">
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

                <SocialButton label="GitHub 登录">
                  <svg
                    className="h-5 w-5 text-[#e5e0f3] transition-colors group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                </SocialButton>

                <SocialButton label="Apple 登录">
                  <svg
                    className="h-5 w-5 text-[#e5e0f3] transition-colors group-hover:text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M16.365 7.422c-.046-2.658 2.164-3.957 2.261-4.015-1.238-1.81-3.155-2.053-3.83-2.079-1.637-.165-3.197.965-4.032.965-.835 0-2.115-.945-3.486-.921-1.787.024-3.433.999-4.354 2.604-1.867 3.238-.477 8.031 1.341 10.655.892 1.282 1.94 2.723 3.324 2.67 1.337-.052 1.839-.863 3.454-.863 1.615 0 2.071.863 3.454.838 1.436-.026 2.339-1.306 3.218-2.59 1.018-1.488 1.438-2.929 1.458-3.006-.03-.013-2.822-1.082-2.808-4.258zM14.654 2.845c.739-.894 1.238-2.137 1.103-3.375-1.066.042-2.355.708-3.118 1.603-.683.803-1.285 2.075-1.127 3.292 1.189.092 2.399-.623 3.142-1.52z" />
                  </svg>
                </SocialButton>
              </div>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#ccc3d8]">
              还没有账号？{" "}
              <Link
                href="/interfaces/register"
                className="font-medium text-[#d2bbff] transition-colors hover:text-[#4cd7f6] hover:underline underline-offset-4"
              >
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
