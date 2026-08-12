import type { TenantTheme } from "@/types/database";

export type ThemeDefinition = {
  description: string;
  id: TenantTheme;
  name: string;
};

export const THEMES = [
  {
    id: "classico",
    name: "Clássico",
    description: "Off-white, grafite e dourado.",
  },
  {
    id: "natural",
    name: "Natural",
    description: "Bege, verde profundo e oliva.",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Cinza claro, marinho e azul vivo.",
  },
  {
    id: "delivery",
    name: "Delivery",
    description: "Branco, marrom e laranja quente.",
  },
  {
    id: "elegante",
    name: "Elegante",
    description: "Preto, branco e rosé gold.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Branco puro, preto e cinza neutro.",
  },
] as const satisfies readonly ThemeDefinition[];

export function getTheme(themeId: TenantTheme): ThemeDefinition {
  return THEMES.find((theme) => theme.id === themeId) ?? THEMES[5];
}
