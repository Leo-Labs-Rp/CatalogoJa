"use client";

import { KeyRound } from "lucide-react";
import { useActionState } from "react";

import { loginWithPasswordAction } from "@/app/painel/actions";
import { Alert } from "@/components/ui/alert";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm() {
  const [state, action] = useActionState(loginWithPasswordAction, {});

  return (
    <form action={action} className="grid gap-5">
      <Field>
        <FieldLabel htmlFor="email">E-mail da assinatura</FieldLabel>
        <Input autoComplete="email" id="email" name="email" placeholder="voce@empresa.com" required type="email" />
        <FieldDescription>Use o mesmo e-mail informado no cadastro. Nenhuma mensagem será enviada.</FieldDescription>
      </Field>

      <Field>
        <FieldLabel htmlFor="password">Senha</FieldLabel>
        <Input autoComplete="current-password" id="password" name="password" placeholder="Sua senha" required type="password" />
        <FieldDescription>A senha é criada na tela de sucesso após a confirmação do pagamento.</FieldDescription>
      </Field>

      {state.error ? <Alert title={state.error} variant="danger" /> : null}
      <SubmitButton className="w-full" pendingLabel="Entrando...">
        <KeyRound aria-hidden="true" />
        Entrar no painel
      </SubmitButton>
    </form>
  );
}
