"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navigationDebugEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ENABLE_NAV_DEBUG === "1";

type DebugLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> &
  LinkProps & {
    label: string;
    sourcePage: string;
  };

function formatTimestamp(date: Date) {
  return date.toISOString();
}

export function DebugLink({
  href,
  label,
  sourcePage,
  onClick,
  ...props
}: DebugLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (!navigationDebugEnabled) {
          onClick?.(event);
          return;
        }

        const timestamp = new Date();
        const hrefValue = typeof href === "string" ? href : href.toString();
        const currentQuery =
          typeof window !== "undefined" ? window.location.search : "";
        const currentUrl = `${pathname}${currentQuery}`;
        const debugPayload = {
          label,
          sourcePage,
          from: currentUrl,
          to: hrefValue,
          timestamp: formatTimestamp(timestamp),
          performanceNow: Number(window.performance.now().toFixed(2)),
          historyLength: window.history.length,
          documentReferrer: document.referrer || "(empty)",
          visibilityState: document.visibilityState,
          pointer: {
            x: event.clientX,
            y: event.clientY,
            button: event.button,
            metaKey: event.metaKey,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            altKey: event.altKey,
          },
        };

        console.groupCollapsed(
          `[nav-click] ${sourcePage} :: ${label} -> ${hrefValue}`,
        );
        console.log("navigation-click", debugPayload);
        console.trace("navigation-click trace");
        console.groupEnd();

        onClick?.(event);
      }}
      {...props}
    />
  );
}

export function PageNavigationDebug({
  pageName,
}: {
  pageName: "create" | "music" | "workbench";
}) {
  const pathname = usePathname();
  const previousUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!navigationDebugEnabled) {
      return;
    }

    const query = typeof window !== "undefined" ? window.location.search : "";
    const currentUrl = `${pathname}${query}`;
    const timestamp = new Date();

    console.groupCollapsed(`[page-enter] ${pageName} :: ${currentUrl}`);
    console.log("page-enter", {
      pageName,
      url: currentUrl,
      timestamp: formatTimestamp(timestamp),
      performanceNow: Number(window.performance.now().toFixed(2)),
      historyLength: window.history.length,
      documentReferrer: document.referrer || "(empty)",
    });
    console.groupEnd();

    return () => {
      console.groupCollapsed(`[page-leave] ${pageName} :: ${currentUrl}`);
      console.log("page-leave", {
        pageName,
        url: currentUrl,
        timestamp: formatTimestamp(new Date()),
        performanceNow: Number(window.performance.now().toFixed(2)),
      });
      console.groupEnd();
    };
  }, [pathname, pageName]);

  useEffect(() => {
    if (!navigationDebugEnabled) {
      return;
    }

    const query = typeof window !== "undefined" ? window.location.search : "";
    const currentUrl = `${pathname}${query}`;

    if (previousUrlRef.current && previousUrlRef.current !== currentUrl) {
      console.groupCollapsed(
        `[route-change] ${pageName} :: ${previousUrlRef.current} -> ${currentUrl}`,
      );
      console.log("route-change", {
        pageName,
        from: previousUrlRef.current,
        to: currentUrl,
        timestamp: formatTimestamp(new Date()),
        historyLength: window.history.length,
        performanceNow: Number(window.performance.now().toFixed(2)),
      });
      console.groupEnd();
    }

    previousUrlRef.current = currentUrl;
  }, [pathname, pageName]);

  return null;
}
