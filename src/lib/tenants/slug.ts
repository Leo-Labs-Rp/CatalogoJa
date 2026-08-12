import { z } from "zod";

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "painel",
  "loja",
  "cadastro",
  "app",
  "www",
] as const;

const reservedSlugs = new Set<string>(RESERVED_SLUGS);

export const tenantSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "O endereço deve ter pelo menos 3 caracteres.")
  .max(60, "O endereço deve ter no máximo 60 caracteres.")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use apenas letras minúsculas, números e hífens entre palavras.",
  )
  .refine((slug) => !reservedSlugs.has(slug), "Este endereço é reservado.");

export function normalizeTenantSlug(value: string): string {
  return tenantSlugSchema.parse(value);
}
