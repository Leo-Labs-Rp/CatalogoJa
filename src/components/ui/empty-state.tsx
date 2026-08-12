import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  icon: LucideIcon;
  title: string;
};

export function EmptyState({ action, description, icon: Icon, title }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-[var(--radius-card)] border border-dashed bg-white px-6 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-brand-50 text-brand-700">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <h3 className="mt-4 font-semibold text-[var(--app-foreground)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--app-foreground-muted)]">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
