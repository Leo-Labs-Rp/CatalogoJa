"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function PanelError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="grid max-w-xl gap-4"><Alert description="Verifique sua conexão e tente novamente. Se continuar, entre novamente no painel." title="Não foi possível carregar esta página" variant="danger" /><div><Button onClick={reset}>Tentar novamente</Button></div></div>;
}
