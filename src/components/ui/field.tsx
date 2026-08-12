import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

export function Field({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("grid gap-2", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      className={cn("text-sm font-semibold text-[var(--app-foreground)]", className)}
      {...props}
    />
  );
}

export function FieldDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs leading-5 text-[var(--app-foreground-muted)]", className)}
      {...props}
    />
  );
}

export function FieldError({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-xs font-medium text-[var(--app-danger)]", className)}
      role="alert"
      {...props}
    />
  );
}
