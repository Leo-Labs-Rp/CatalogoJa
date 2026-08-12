"use client";

import { KeyRound, Mail } from "lucide-react";
import { useActionState, useState } from "react";

import { sendMagicLinkAction } from "@/app/painel/actions";
import { Alert } from "@/components/ui/alert";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm({ passwordLoginEnabled = false }: { passwordLoginEnabled?: boolean }) {
  const [state, action] = useActionState(sendMagicLinkAction, {});
  const [password, setPassword] = useState("");
  const isPasswordLogin = passwordLoginEnabled && password.length > 0;

  return (
    <form action={action} className="grid gap-5">
      <Field>
        <FieldLabel htmlFor="email">E-mail da assinatura</FieldLabel>
        <Input autoComplete="email" id="email" name="email" placeholder="voce@empresa.com" required type="email" />
        <FieldDescription>{passwordLoginEnabled ? "Use o e-mail cadastrado no Supabase." : "Enviaremos um link seguro. Você não precisa memorizar senha."}</FieldDescription>
      </Field>

      {passwordLoginEnabled ? (
        <Field>
          <FieldLabel htmlFor="password">Senha</FieldLabel>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Sua senha"
            type="password"
            value={password}
          />
          <FieldDescription>No ambiente local, deixe vazio apenas se preferir receber o magic link.</FieldDescription>
        </Field>
      ) : null}

      {state.error ? <Alert title={state.error} variant="danger" /> : null}
      {state.success ? <Alert title={state.success} variant="success" /> : null}

      <SubmitButton className="w-full" pendingLabel={isPasswordLogin ? "Entrando..." : "Enviando link..."}>
        {isPasswordLogin ? <KeyRound aria-hidden="true" /> : <Mail aria-hidden="true" />}
        {isPasswordLogin ? "Entrar no painel" : "Enviar link de acesso"}
      </SubmitButton>
    </form>
  );
}
