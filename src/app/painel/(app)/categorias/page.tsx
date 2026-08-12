import type { Metadata } from "next";

import { CategoryManager } from "@/components/painel/category-manager";
import { PageHeader } from "@/components/ui/page-header";
import { requireTenant } from "@/lib/auth/session";
import { DEMO_CATEGORIES, DEMO_PRODUCTS } from "@/lib/demo/panel-demo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Categorias" };
export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { demo, tenant } = await requireTenant();
  if (demo) {
    return <div className="grid gap-7"><PageHeader description="Crie seções e defina a ordem em que elas aparecem no catálogo." eyebrow="Organização" title="Categorias" /><CategoryManager initialCategories={DEMO_CATEGORIES.map((category) => ({ id: category.id, nome: category.nome, ordem: category.ordem, productCount: DEMO_PRODUCTS.filter((product) => product.category_id === category.id).length }))} /></div>;
  }
  const supabase = await createClient();
  const [{ data: categories, error }, { data: products }] = await Promise.all([
    supabase.from("categories").select("id,nome,ordem").eq("tenant_id", tenant.id).order("ordem").order("created_at"),
    supabase.from("products").select("category_id").eq("tenant_id", tenant.id),
  ]);

  if (error) throw new Error("Não foi possível carregar as categorias.");
  const counts = new Map<string, number>();
  products?.forEach((product) => counts.set(product.category_id, (counts.get(product.category_id) ?? 0) + 1));

  return (
    <div className="grid gap-7">
      <PageHeader description="Crie seções e defina a ordem em que elas aparecem no catálogo." eyebrow="Organização" title="Categorias" />
      <CategoryManager initialCategories={(categories ?? []).map((category) => ({ ...category, productCount: counts.get(category.id) ?? 0 }))} />
    </div>
  );
}
