 "use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DebugLink } from "@/components/debug/navigation-debug";
import {
  HeaderNavActiveUnderline,
  HeaderAvatar,
  HeaderCreditsBadge,
  HeaderUpgradeLink,
  SiteLogo,
  headerNavLinkClass,
} from "@/components/site/header-primitives";

type TopbarNavItem = {
  href: string;
  label: string;
  active?: boolean;
  debugLabel?: string;
  sourcePage: string;
};

export function AppTopbar({
  sourcePage,
  navItems,
  creditsLabel = "50 积分",
  rightSlot,
  className = "",
  innerClassName = "",
}: {
  sourcePage: string;
  navItems: TopbarNavItem[];
  creditsLabel?: string;
  rightSlot?: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className={`fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-[#14121f]/72 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-[20px] ${className}`}
    >
      <div
        className={`mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-0 lg:px-8 ${innerClassName}`}
      >
        <div className="flex min-w-0 items-center gap-4 lg:gap-10">
          <SiteLogo />
          <div className="hidden items-center gap-5 lg:gap-6 md:flex">
            {navItems.map((item) => (
              <DebugLink
                key={item.href + item.label}
                href={item.href}
                label={item.debugLabel ?? `${sourcePage}-nav-${item.label}`}
                sourcePage={item.sourcePage}
                className={headerNavLinkClass(item.active)}
              >
                {item.label}
                {item.active ? <HeaderNavActiveUnderline /> : null}
              </DebugLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">
            <HeaderCreditsBadge label={creditsLabel} />
          </div>
          <div className="hidden sm:block">
            <HeaderUpgradeLink />
          </div>
          <div className="hidden md:flex md:items-center md:gap-4">
            {rightSlot ?? <HeaderAvatar />}
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#4a4455]/20 bg-[#1c1a27]/80 text-[#e5e0f3] transition-colors hover:border-[#7c3aed]/40 hover:text-white md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "关闭导航菜单" : "打开导航菜单"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen ? (
        <div className="border-t border-white/5 bg-[#14121f]/95 md:hidden">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-4 py-4">
            <div className="flex items-center justify-between gap-3 sm:hidden">
              <HeaderCreditsBadge label={creditsLabel} />
              <HeaderUpgradeLink />
            </div>

            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <DebugLink
                  key={`${item.href}-${item.label}-mobile`}
                  href={item.href}
                  label={item.debugLabel ?? `${sourcePage}-nav-${item.label}`}
                  sourcePage={item.sourcePage}
                  className={`rounded-xl px-3 py-2.5 ${headerNavLinkClass(item.active, "w-full justify-between")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{item.label}</span>
                  {item.active ? (
                    <span className="inline-flex rounded-full bg-[#7c3aed]/20 px-2 py-0.5 text-[11px] text-[#d2bbff]">
                      当前
                    </span>
                  ) : null}
                </DebugLink>
              ))}
            </div>

            <div className="flex items-center justify-end border-t border-white/5 pt-3">
              {rightSlot ?? <HeaderAvatar />}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
