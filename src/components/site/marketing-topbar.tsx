import type { ReactNode } from "react";
import { DebugLink } from "@/components/debug/navigation-debug";
import {
  HeaderNavActiveUnderline,
  SiteLogo,
  headerNavLinkClass,
} from "@/components/site/header-primitives";

type MarketingNavItem = {
  href: string;
  label: string;
  active?: boolean;
  debugLabel?: string;
  sourcePage: string;
};

export function MarketingTopbar({
  sourcePage,
  navItems,
  rightSlot,
}: {
  sourcePage: string;
  navItems: MarketingNavItem[];
  rightSlot: ReactNode;
}) {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-[#14121f]/72 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-[20px]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-6 lg:gap-10">
          <SiteLogo />
          <div className="hidden items-center gap-6 md:flex">
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
        <div className="flex items-center gap-4">{rightSlot}</div>
      </div>
    </nav>
  );
}
