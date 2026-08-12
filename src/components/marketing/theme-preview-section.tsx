"use client";

import { useState } from "react";

import { StorePreview } from "@/components/loja-publica/store-preview";
import { ThemePicker } from "@/components/loja-publica/theme-picker";
import { Card } from "@/components/ui/card";
import { marketingCatalog } from "@/lib/design-system/marketing-catalog";
import { getTheme } from "@/lib/design-system/themes";
import type { TenantTheme } from "@/types/database";

export function ThemePreviewSection() {
  const [theme, setTheme] = useState<TenantTheme>("natural");
  const selected = getTheme(theme);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[0.75fr_1.25fr]">
      <Card className="p-4 sm:p-5 lg:sticky lg:top-5">
        <ThemePicker onValueChange={setTheme} value={theme} />
        <div className="mt-4 rounded-lg bg-[var(--app-surface-muted)] p-3"><p className="text-sm font-semibold">Tema {selected.name}</p><p className="mt-1 text-xs leading-5 text-[var(--app-foreground-muted)]">{selected.description} Você pode trocar quando quiser.</p></div>
      </Card>
      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600">Prévia interativa</p><div className="max-h-[43rem] overflow-auto rounded-[var(--radius-panel)]"><StorePreview catalog={{ ...marketingCatalog, tema: theme }} framed theme={theme} /></div></div>
    </div>
  );
}
