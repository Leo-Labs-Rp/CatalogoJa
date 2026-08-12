import { ArrowRight, Check, CreditCard, LayoutTemplate, MessageCircle, MousePointerClick, Paintbrush, PackageCheck, ShoppingBag, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { ThemePreviewSection } from "@/components/marketing/theme-preview-section";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sua loja no WhatsApp em minutos" };

const steps = [
  { description: "Conte o nome da loja, seu WhatsApp e o endereço desejado.", icon: MousePointerClick, number: "01", title: "Preencha seus dados" },
  { description: "Escolha entre seis identidades visuais prontas e profissionais.", icon: Paintbrush, number: "02", title: "Escolha seu tema" },
  { description: "Cadastre produtos e compartilhe um único link com seus clientes.", icon: Zap, number: "03", title: "Coloque a loja no ar" },
];

const benefits = ["Loja publicada 24 horas por dia", "6 temas profissionais", "Produtos ilimitados", "Edição a qualquer momento"];

export default function HomePage() {
  return (
    <main className="overflow-hidden">
      <nav className="relative z-10 border-b bg-white/90 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"><Link className="flex min-h-11 items-center gap-2 font-bold tracking-tight" href="/"><span className="grid size-8 place-items-center rounded-lg bg-brand-900 text-white"><ShoppingBag aria-hidden="true" className="size-4" /></span>CatalogoJá</Link><div className="flex items-center gap-2"><Link className={buttonVariants({ size: "sm", variant: "ghost" })} href="/painel">Entrar</Link><Link className={buttonVariants({ size: "sm" })} href="/cadastro">Quero minha loja</Link></div></div></nav>

      <section className="relative bg-[linear-gradient(135deg,var(--brand-50),white_55%,var(--brand-100))] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="absolute -right-40 -top-40 size-[34rem] rounded-full bg-[var(--brand-accent)]/30 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div><span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-semibold text-brand-700"><Sparkles aria-hidden="true" className="size-3.5" />Catálogo simples. Pedido direto.</span><h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-6xl">Sua loja no WhatsApp em minutos</h1><p className="mt-6 max-w-xl text-lg leading-8 text-[var(--app-foreground-muted)]">Organize seus produtos em um catálogo bonito, compartilhe o link e receba pedidos no WhatsApp — sem complicação.</p><div className="mt-8 flex flex-wrap items-center gap-3"><Link className={buttonVariants({ size: "lg" })} href="/cadastro">Quero minha loja<ArrowRight aria-hidden="true" /></Link><Link className={buttonVariants({ size: "lg", variant: "secondary" })} href="#temas">Ver os temas</Link></div><p className="mt-4 text-xs text-[var(--app-foreground-muted)]">R$ 27/mês · cancele quando quiser</p></div>
          <div className="relative mx-auto w-full max-w-lg"><div className="absolute -inset-8 rounded-full bg-brand-200/60 blur-3xl" /><Card className="relative overflow-hidden border-brand-200 p-3 shadow-[0_30px_80px_rgb(19_50_41_/_18%)] sm:p-5"><div className="rounded-xl bg-brand-900 p-5 text-white"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center rounded-xl bg-white/10"><ShoppingBag aria-hidden="true" /></span><span className="rounded-full bg-[var(--brand-accent)] px-3 py-1 text-xs font-bold text-brand-900">LOJA NO AR</span></div><h2 className="mt-7 text-2xl font-bold">Seu catálogo profissional</h2><p className="mt-2 text-sm text-white/70">Produtos organizados e pedidos sem atrito.</p></div><div className="grid grid-cols-2 gap-3 p-2 pt-5"><MiniBenefit icon={LayoutTemplate} label="Visual profissional" /><MiniBenefit icon={PackageCheck} label="Itens ilimitados" /><MiniBenefit icon={MessageCircle} label="Pedido no WhatsApp" /><MiniBenefit icon={CreditCard} label="Só R$ 27/mês" /></div></Card></div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="Como funciona" title="Do cadastro ao primeiro pedido em três passos" description="Você cuida dos seus produtos; o CatalogoJá organiza o caminho até o WhatsApp." /><div className="mt-10 grid gap-4 md:grid-cols-3">{steps.map(({ description, icon: Icon, number, title }) => <Card className="relative overflow-hidden p-6" key={number}><span className="absolute right-4 top-2 text-6xl font-black text-brand-50">{number}</span><span className="relative grid size-11 place-items-center rounded-xl bg-brand-100 text-brand-700"><Icon aria-hidden="true" /></span><h3 className="relative mt-5 text-lg font-bold">{title}</h3><p className="relative mt-2 text-sm leading-6 text-[var(--app-foreground-muted)]">{description}</p></Card>)}</div></div></section>

      <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8" id="temas"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="A cara do seu negócio" title="Seis temas. Uma loja que parece sua." description="Teste cada identidade visual agora. O conteúdo permanece organizado e responsivo em todas elas." /><div className="mt-10"><ThemePreviewSection /></div></div></section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto max-w-4xl"><Card className="grid overflow-hidden border-brand-200 lg:grid-cols-[1fr_0.8fr]"><div className="p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Plano completo</p><h2 className="mt-2 text-3xl font-bold">Tudo para vender melhor</h2><ul className="mt-7 grid gap-4">{benefits.map((benefit) => <li className="flex items-center gap-3 text-sm" key={benefit}><span className="grid size-6 place-items-center rounded-full bg-brand-100 text-brand-700"><Check aria-hidden="true" className="size-3.5" strokeWidth={3} /></span>{benefit}</li>)}</ul></div><div className="flex flex-col justify-center bg-brand-900 p-7 text-white sm:p-10"><p className="text-sm text-white/70">Por apenas</p><p className="mt-1 flex items-end gap-2"><span className="text-5xl font-black tracking-tight">R$27</span><span className="pb-1 text-white/70">/mês</span></p><Link className={buttonVariants({ className: "mt-7 bg-[var(--brand-accent)] text-brand-900 hover:bg-white", size: "lg" })} href="/cadastro">Quero minha loja<ArrowRight aria-hidden="true" /></Link></div></Card></div></section>

      <section className="bg-brand-100 px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8"><div className="mx-auto max-w-2xl"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Seu próximo pedido pode começar aqui</h2><p className="mt-4 text-[var(--app-foreground-muted)]">Crie seu catálogo, compartilhe o link e deixe seus produtos trabalharem por você.</p><Link className={buttonVariants({ className: "mt-7", size: "lg" })} href="/cadastro">Quero minha loja<ArrowRight aria-hidden="true" /></Link></div></section>

      <footer className="border-t bg-white px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-[var(--app-foreground-muted)] sm:flex-row"><p>© {new Date().getFullYear()} CatalogoJá</p><div className="flex gap-5"><Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/termos">Termos</Link><Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/privacidade">Privacidade</Link><Link className="inline-flex min-h-11 min-w-11 items-center justify-center" href="/painel">Painel</Link></div></div></footer>
    </main>
  );
}

function MiniBenefit({ icon: Icon, label }: { icon: typeof LayoutTemplate; label: string }) { return <div className="rounded-lg bg-[var(--app-surface-muted)] p-3"><Icon aria-hidden="true" className="size-4 text-brand-700" /><p className="mt-3 text-xs font-semibold">{label}</p></div>; }
function SectionTitle({ description, eyebrow, title }: { description: string; eyebrow: string; title: string }) { return <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{eyebrow}</p><h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 leading-7 text-[var(--app-foreground-muted)]">{description}</p></div>; }
