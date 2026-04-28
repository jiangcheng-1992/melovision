import Link from "next/link";
import { Sparkles } from "lucide-react";

export function SiteLogo({
  href = "/",
  className = "",
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01] ${className}`}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d2bbff]/20 bg-[linear-gradient(135deg,rgba(124,58,237,0.28),rgba(3,181,211,0.22))] shadow-[0_0_20px_rgba(124,58,237,0.18)]">
        <Sparkles className="h-4 w-4 text-[#d2bbff]" />
      </span>
      <span className="bg-gradient-to-r from-[#f3eeff] via-[#d2bbff] to-[#4cd7f6] bg-clip-text text-xl font-semibold tracking-[-0.03em] text-transparent">
        MeloVision
      </span>
    </Link>
  );
}

export function headerNavLinkClass(active = false, className = "") {
  return `relative inline-flex items-center pb-1 text-sm font-medium tracking-tight transition-colors duration-200 ${
    active ? "text-[#f5f3ff]" : "text-[#a9a2ba] hover:text-[#f5f3ff]"
  } ${className}`;
}

export function HeaderNavActiveUnderline() {
  return (
    <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-gradient-to-r from-[#7c3aed] to-[#4cd7f6] shadow-[0_0_12px_rgba(76,215,246,0.35)]" />
  );
}

export function HeaderCreditsBadge({
  label,
}: {
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#4a4455]/20 bg-[#201e2c]/80 px-3 py-1.5 text-sm text-[#d7d2e5] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl">
      <Sparkles className="h-3.5 w-3.5 text-[#4cd7f6]" />
      <span>{label}</span>
    </div>
  );
}

export function HeaderUpgradeLink({
  href = "/interfaces/pricing",
}: {
  href?: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-full border border-[#4a4455]/20 bg-[#2b2836] px-4 py-1.5 text-sm font-medium text-[#f5f3ff] transition-all duration-200 hover:scale-[1.02] hover:border-[#7c3aed]/30 hover:bg-[#363342]"
    >
      升级
    </Link>
  );
}

export function HeaderAvatar({
  label = "MV",
}: {
  label?: string;
}) {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d2bbff]/20 bg-[radial-gradient(circle_at_30%_30%,rgba(210,187,255,0.28),rgba(43,40,54,1))] text-xs font-semibold text-[#f5f3ff] shadow-[0_0_16px_rgba(124,58,237,0.12)]">
      {label}
    </div>
  );
}
