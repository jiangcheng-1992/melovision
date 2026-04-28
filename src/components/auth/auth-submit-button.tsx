"use client";

import type { ReactNode } from "react";
import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export function AuthSubmitButton({
  idleLabel,
  pendingLabel,
  className,
  icon,
}: {
  idleLabel: string;
  pendingLabel: string;
  className: string;
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} ${pending ? "cursor-wait opacity-80" : ""}`}
    >
      {pending ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        <>
          <span>{idleLabel}</span>
          {icon}
        </>
      )}
    </button>
  );
}
