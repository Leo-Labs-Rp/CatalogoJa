import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-[var(--app-surface-muted)] text-[var(--app-foreground-muted)]",
        success: "bg-[var(--app-success-soft)] text-[var(--app-success)]",
        warning: "bg-amber-50 text-amber-800",
        danger: "bg-[var(--app-danger-soft)] text-[var(--app-danger)]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ className, variant }))} {...props} />;
}
