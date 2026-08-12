import type { LucideIcon } from "lucide-react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

const alertStyles = {
  danger: "border-red-200 bg-red-50 text-red-950",
  info: "border-blue-200 bg-blue-50 text-blue-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-200 bg-amber-50 text-amber-950",
} as const;

const icons = {
  danger: AlertCircle,
  info: Info,
  success: CheckCircle2,
  warning: AlertCircle,
} as const;

export type AlertProps = ComponentProps<"div"> & {
  description?: ReactNode;
  icon?: LucideIcon;
  title: string;
  variant?: keyof typeof alertStyles;
};

export function Alert({
  className,
  description,
  icon,
  title,
  variant = "info",
  ...props
}: AlertProps) {
  const Icon = icon ?? icons[variant];

  return (
    <div
      className={cn("flex gap-3 rounded-[var(--radius-card)] border p-4", alertStyles[variant], className)}
      role={variant === "danger" ? "alert" : "status"}
      {...props}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{title}</p>
        {description ? <div className="mt-1 text-sm leading-6 opacity-80">{description}</div> : null}
      </div>
    </div>
  );
}
