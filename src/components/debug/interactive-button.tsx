"use client";

import { useEffect, useRef, useState } from "react";

type InteractiveButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  actionId: string;
  sourcePage: string;
  activeClassName?: string;
  inactiveClassName?: string;
  resetAfterMs?: number;
};

export function InteractiveButton({
  actionId,
  sourcePage,
  className,
  activeClassName,
  inactiveClassName,
  resetAfterMs = 1600,
  onClick,
  children,
  ...props
}: InteractiveButtonProps) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <button
      {...props}
      onClick={(event) => {
        console.groupCollapsed(`[ui-click] ${sourcePage} :: ${actionId}`);
        console.log("ui-click", {
          actionId,
          sourcePage,
          timestamp: new Date().toISOString(),
          performanceNow: Number(window.performance.now().toFixed(2)),
          pointer: {
            x: event.clientX,
            y: event.clientY,
            button: event.button,
          },
        });
        console.trace("ui-click trace");
        console.groupEnd();

        setActive(true);

        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
          setActive(false);
        }, resetAfterMs);

        onClick?.(event);
      }}
      className={[
        className,
        active ? activeClassName : inactiveClassName,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </button>
  );
}
