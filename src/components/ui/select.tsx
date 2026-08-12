import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-[var(--radius-control)] border bg-white px-3 text-sm text-[var(--app-foreground)] outline-none transition-[border-color,box-shadow] hover:border-neutral-400 focus:border-brand-600 focus:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:bg-[var(--app-surface-muted)] disabled:opacity-70 aria-invalid:border-[var(--app-danger)]",
        className,
      )}
      {...props}
    />
  );
}
