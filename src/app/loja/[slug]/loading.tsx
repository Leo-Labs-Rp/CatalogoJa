import { Skeleton } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6"><Skeleton className="h-56 w-full rounded-[var(--radius-panel)]" /><div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <Skeleton className="h-72" key={index} />)}</div></main>;
}
