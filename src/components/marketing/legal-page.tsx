import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ children, description, title }: { children: ReactNode; description: string; title: string }) {
  return <main className="min-h-screen bg-white"><header className="border-b"><div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4"><Link className="flex min-h-11 items-center gap-2 font-bold" href="/"><span className="grid size-8 place-items-center rounded-lg bg-brand-900 text-white"><ShoppingBag aria-hidden="true" className="size-4" /></span>CatalogoJá</Link><Link className="flex min-h-11 items-center gap-2 text-sm text-[var(--app-foreground-muted)]" href="/cadastro"><ArrowLeft aria-hidden="true" className="size-4" />Voltar ao cadastro</Link></div></header><article className="mx-auto max-w-4xl px-4 py-12"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Documento legal</p><h1 className="mt-2 text-3xl font-bold">{title}</h1><p className="mt-3 leading-7 text-[var(--app-foreground-muted)]">{description}</p><p className="mt-2 text-xs text-[var(--app-foreground-muted)]">Última atualização: 19 de julho de 2026</p><div className="mt-10 grid gap-8 text-sm leading-7 [&_h2]:text-lg [&_h2]:font-bold [&_p]:text-[var(--app-foreground-muted)]">{children}</div></article></main>;
}
