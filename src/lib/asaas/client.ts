import "server-only";

import { z } from "zod";

import { CATALOGOJA_MONTHLY_PLAN } from "@/lib/billing/plan";
import { requireAsaasEnv } from "@/lib/env/server";

const checkoutResponseSchema = z.object({
  id: z.string(),
  link: z.url().optional(),
});

export type CreateCheckoutInput = {
  externalReference: string;
  nextDueDate: string;
  successUrl: string;
};

function checkoutUrl(id: string, link: string | undefined, apiUrl: string) {
  if (link) {
    const parsed = new URL(link);
    const officialHost = parsed.hostname === "asaas.com" || parsed.hostname.endsWith(".asaas.com");
    if (parsed.protocol === "https:" && officialHost) return parsed.toString();
  }

  const host = apiUrl.includes("sandbox") ? "https://sandbox.asaas.com" : "https://asaas.com";
  return `${host}/checkoutSession/show?id=${encodeURIComponent(id)}`;
}

export async function createRecurringCheckout(input: CreateCheckoutInput) {
  const env = requireAsaasEnv();
  const response = await fetch(`${env.apiUrl}/checkouts`, {
    body: JSON.stringify({
      billingTypes: ["CREDIT_CARD"],
      callback: {
        cancelUrl: input.successUrl.replace("/sucesso", ""),
        expiredUrl: input.successUrl.replace("/sucesso", ""),
        successUrl: input.successUrl,
      },
      chargeTypes: ["RECURRENT"],
      externalReference: input.externalReference,
      items: [{ description: CATALOGOJA_MONTHLY_PLAN.description, name: CATALOGOJA_MONTHLY_PLAN.name, quantity: 1, value: CATALOGOJA_MONTHLY_PLAN.value }],
      minutesToExpire: 60,
      subscription: { cycle: CATALOGOJA_MONTHLY_PLAN.cycle, nextDueDate: input.nextDueDate },
    }),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": `CatalogoJa/0.1.0 (${env.environment})`,
      access_token: env.apiKey,
    },
    method: "POST",
    signal: AbortSignal.timeout(15_000),
  });

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message = z.object({ errors: z.array(z.object({ description: z.string() })).optional() }).safeParse(body);
    throw new Error(message.success ? message.data.errors?.[0]?.description ?? "O Asaas recusou a criação do checkout." : "O Asaas recusou a criação do checkout.");
  }

  const checkout = checkoutResponseSchema.parse(body);
  return { id: checkout.id, link: checkoutUrl(checkout.id, checkout.link, env.apiUrl) };
}
