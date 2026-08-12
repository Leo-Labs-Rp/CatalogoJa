import { Clock3, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/painel/actions";
import { PanelShell } from "@/components/painel/panel-shell";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPanelContext } from "@/lib/auth/session";

export default async function ProtectedPanelLayout({ children }: { children: React.ReactNode }) {
  const context = await getPanelContext();

  if (!context.configured) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <Card className="max-w-xl"><CardContent className="grid gap-5 p-7"><Alert icon={Settings} title="Painel pronto para conectar" description="Crie o arquivo .env.local com as chaves do Supabase. Até lá, nenhuma chamada externa é feita e o projeto continua compilando normalmente." variant="warning" /><Link className={buttonVariants({ variant: "secondary" })} href="/painel">Voltar ao acesso</Link></CardContent></Card>
      </main>
    );
  }

  if (!context.authenticated) redirect("/painel");

  if (!context.tenant) {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <Card className="max-w-xl"><CardContent className="grid gap-5 p-7"><Alert icon={Clock3} title="Sua loja ainda está sendo preparada" description="O pagamento pode levar alguns instantes para chegar. Saia, aguarde a confirmação e tente novamente mais tarde." variant="warning" /><form action={signOutAction}><Button type="submit" variant="secondary"><LogOut aria-hidden="true" />Sair e tentar depois</Button></form></CardContent></Card>
      </main>
    );
  }

  return <PanelShell demo={context.demo} slug={context.tenant.slug} status={context.tenant.status} storeName={context.tenant.nome_loja} userEmail={context.userEmail}>{children}</PanelShell>;
}
