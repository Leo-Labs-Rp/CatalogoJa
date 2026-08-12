import { Skeleton } from "@/components/ui/skeleton";

export default function PanelLoading() {
  return <div className="grid gap-7"><div className="grid gap-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-64" /><Skeleton className="h-5 max-w-xl" /></div><Skeleton className="h-72 w-full rounded-[var(--radius-panel)]" /></div>;
}
