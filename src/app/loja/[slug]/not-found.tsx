import { SearchX } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function StoreNotFound() {
  return <main className="grid min-h-screen place-items-center px-4 text-center"><div className="max-w-md"><span className="mx-auto grid size-14 place-items-center rounded-full bg-brand-100 text-brand-700"><SearchX aria-hidden="true" /></span><h1 className="mt-5 text-2xl font-bold">Esta loja não foi encontrada</h1><p className="mt-2 text-sm leading-6 text-[var(--app-foreground-muted)]">Confira o endereço digitado ou peça um novo link para a loja.</p><Link className={buttonVariants({ className: "mt-6" })} href="/">Ir para o início</Link></div></main>;
}
