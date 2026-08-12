"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";

import { getSiteUrl } from "@/lib/env/server";
import { isSupabaseConfigured } from "@/lib/env/public";
import { DEMO_COOKIE_NAME, isDemoAccessEnabled, isEmailAuthEnabled, isLocalPasswordLoginEnabled } from "@/lib/demo/panel-demo";
import { createClient } from "@/lib/supabase/server";

export type LoginActionState = {
  error?: string;
  success?: string;
};

const loginSchema = z.object({
  password: z.string().max(256).optional(),
  email: z.email("Digite um e-mail válido."),
});

export async function sendMagicLinkAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const passwordValue = formData.get("password");
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: typeof passwordValue === "string" ? passwordValue : undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "E-mail inválido." };
  }

  const email = parsed.data.email.toLowerCase();
  const password = parsed.data.password ?? "";

  if (isLocalPasswordLoginEnabled() && password) {
    try {
      (await cookies()).delete(DEMO_COOKIE_NAME);

      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        return { error: "E-mail ou senha inválidos." };
      }
    } catch {
      return { error: "Configure o Supabase no arquivo .env.local para ativar o acesso." };
    }

    redirect("/painel/loja");
  }

  if (!isEmailAuthEnabled()) {
    return { error: "O acesso por e-mail ainda não está habilitado. Use uma conta de teste local ou a demonstração." };
  }

  try {
    // A real login must always leave the read-only demo session behind.
    (await cookies()).delete(DEMO_COOKIE_NAME);

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/painel/loja`,
        shouldCreateUser: false,
      },
    });

    if (error) {
      return { error: "Não foi possível enviar o link. Confira o e-mail da sua assinatura." };
    }

    return { success: "Link enviado. Confira sua caixa de entrada e também o spam." };
  } catch {
    return { error: "Configure o Supabase no arquivo .env.local para ativar o acesso." };
  }
}

export async function startDemoAction() {
  if (!isDemoAccessEnabled()) redirect("/painel");

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // A demonstração usa dados locais e continua disponível sem o Supabase.
    }
  }

  (await cookies()).set(DEMO_COOKIE_NAME, "1", {
    httpOnly: true,
    maxAge: 60 * 60 * 8,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/painel/loja");
}

export async function signOutAction() {
  (await cookies()).delete(DEMO_COOKIE_NAME);
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      await supabase.auth.signOut();
    }
  } finally {
    redirect("/painel");
  }
}
