import Link from "next/link";
import { MarketingTopbar } from "@/components/site/marketing-topbar";

type PublicTopbarVariant = "default" | "login" | "register";
type PublicNavKey = "home" | "explore" | "pricing" | "create";

function buildNavItems(activeNav?: PublicNavKey) {
  return [
    {
      href: "/",
      label: "产品展示",
      active: activeNav === "home",
      sourcePage: activeNav ?? "public",
    },
    {
      href: "/interfaces/explore",
      label: "作品广场",
      active: activeNav === "explore",
      sourcePage: activeNav ?? "public",
    },
    {
      href: "/interfaces/pricing",
      label: "价格方案",
      active: activeNav === "pricing",
      sourcePage: activeNav ?? "public",
    },
    {
      href: "/interfaces/create",
      label: "工作台",
      active: activeNav === "create",
      sourcePage: activeNav ?? "public",
    },
  ];
}

function renderRightSlot(variant: PublicTopbarVariant) {
  if (variant === "login") {
    return (
      <>
        <Link
          href="/interfaces/register"
          className="hidden text-sm text-[#a9a2ba] transition-colors hover:text-[#f5f3ff] sm:block"
        >
          注册
        </Link>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.24)] transition hover:scale-[1.02]"
        >
          返回首页
        </Link>
      </>
    );
  }

  if (variant === "register") {
    return (
      <>
        <Link
          href="/interfaces/login"
          className="hidden text-sm text-[#a9a2ba] transition-colors hover:text-[#f5f3ff] sm:block"
        >
          登录
        </Link>
        <Link
          href="/"
          className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.24)] transition hover:scale-[1.02]"
        >
          返回首页
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/interfaces/login"
        className="hidden text-sm text-[#a9a2ba] transition-colors hover:text-[#f5f3ff] sm:block"
      >
        登录
      </Link>
      <Link
        href="/interfaces/register"
        className="rounded-full bg-gradient-to-r from-[#7c3aed] to-[#03b5d3] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(124,58,237,0.24)] transition hover:scale-[1.02]"
      >
        开始使用
      </Link>
    </>
  );
}

export function PublicTopbar({
  activeNav,
  variant = "default",
  sourcePage = "public",
}: {
  activeNav?: PublicNavKey;
  variant?: PublicTopbarVariant;
  sourcePage?: string;
}) {
  return (
    <MarketingTopbar
      sourcePage={sourcePage}
      navItems={buildNavItems(activeNav).map((item) => ({
        ...item,
        sourcePage,
      }))}
      rightSlot={renderRightSlot(variant)}
    />
  );
}
