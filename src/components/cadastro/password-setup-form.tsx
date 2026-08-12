"use client";

import { KeyRound, LoaderCircle } from "lucide-react";
import { useState } from "react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type PasswordSetupFormProps = {
  onConfigured: () => void;
  reference: string;
};

export function PasswordSetupForm({ onConfigured, reference }: PasswordSetupFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Crie uma senha com pelo menos 8 caracteres.");
      return;
    }

    if (password !== confirmation) {
      setError("As duas senhas precisam ser iguais.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/cadastro/definir-senha", {
        body: JSON.stringify({ email, password, reference }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const result = await response.json() as { configured?: boolean; error?: string };

      if (!response.ok) {
        if (result.configured) onConfigured();
        throw new Error(result.error ?? "Não foi possível criar a senha.");
      }

      const supabase = createClient();
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

      if (loginError) {
        onConfigured();
        throw new Error("A senha foi criada. Entre pelo painel usando o mesmo e-mail e senha.");
      }

      window.location.assign("/painel/loja");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível criar a senha.");
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-6 grid gap-4 rounded-[var(--radius-card)] border bg-[var(--app-surface-muted)] p-4 sm:p-5" onSubmit={submit}>
      <div>
        <div className="flex items-center gap-2 font-semibold">
          <KeyRound aria-hidden="true" className="size-5 text-brand-700" />
          Crie sua senha de acesso
        </div>
        <p className="mt-1 text-sm leading-6 text-[var(--app-foreground-muted)]">
          Nenhum e-mail será enviado. Use o mesmo endereço informado no cadastro.
        </p>
      </div>

      {error ? <Alert title={error} variant="danger" /> : null}

      <Field>
        <FieldLabel htmlFor="setup-email">E-mail da assinatura</FieldLabel>
        <Input
          autoComplete="email"
          disabled={submitting}
          id="setup-email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="voce@empresa.com"
          required
          type="email"
          value={email}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="setup-password">Senha</FieldLabel>
          <Input
            autoComplete="new-password"
            disabled={submitting}
            id="setup-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
          <FieldDescription>Mínimo de 8 caracteres.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="setup-confirmation">Confirmar senha</FieldLabel>
          <Input
            autoComplete="new-password"
            disabled={submitting}
            id="setup-confirmation"
            minLength={8}
            onChange={(event) => setConfirmation(event.target.value)}
            required
            type="password"
            value={confirmation}
          />
        </Field>
      </div>

      <Button disabled={submitting} size="lg" type="submit">
        {submitting ? <LoaderCircle aria-hidden="true" className="animate-spin" /> : <KeyRound aria-hidden="true" />}
        {submitting ? "Criando acesso..." : "Criar senha e entrar"}
      </Button>
    </form>
  );
}
