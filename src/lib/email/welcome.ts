import "server-only";

import { getResendEnv, getSiteUrl } from "@/lib/env/server";

export async function sendWelcomeEmail({ email, slug, storeName }: { email: string; slug: string; storeName: string }) {
  const env = getResendEnv();
  if (!env) return;

  const siteUrl = getSiteUrl();
  const storeUrl = `${siteUrl}/loja/${slug}`;
  const panelUrl = `${siteUrl}/painel`;
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: env.from,
      html: `<h1>${escapeHtml(storeName)} está no ar!</h1><p>Sua loja foi criada com sucesso.</p><p><a href="${storeUrl}">Abrir loja pública</a></p><p><a href="${panelUrl}">Acessar painel</a></p><p>Use o mesmo e-mail da assinatura para receber seu link seguro de acesso.</p>`,
      subject: `${storeName}: sua loja já está no ar`,
      to: [email],
    }),
    headers: { Authorization: `Bearer ${env.apiKey}`, "Content-Type": "application/json" },
    method: "POST",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) console.error("Não foi possível enviar o e-mail de boas-vindas.");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] ?? character);
}
