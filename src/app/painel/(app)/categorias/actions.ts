"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { actionError, type ActionResult } from "@/lib/actions/result";
import { requireTenant } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";

const categorySchema = z.object({
  id: z.uuid().optional(),
  nome: z.string().trim().min(1, "Digite o nome da categoria.").max(80),
});

type SavedCategory = {
  id: string;
  nome: string;
  ordem: number;
};

type SaveCategoryResult = {
  category: SavedCategory;
  showGroupingSuggestion: boolean;
};

export async function saveCategoryAction(input: { id?: string; nome: string }): Promise<ActionResult<SaveCategoryResult>> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dados inválidos.", ok: false };

  try {
    const { demo, tenant } = await requireTenant();
    if (demo) return { error: "O modo de demonstração não salva alterações.", ok: false };
    const supabase = await createClient();

    let category: SavedCategory;
    let showGroupingSuggestion = false;

    if (parsed.data.id) {
      const { data, error } = await supabase
        .from("categories")
        .update({ nome: parsed.data.nome })
        .eq("id", parsed.data.id)
        .eq("tenant_id", tenant.id)
        .select("id, nome, ordem")
        .single();
      if (error) throw error;
      category = data;
    } else {
      const { count, error: countError } = await supabase
        .from("categories")
        .select("id", { count: "exact", head: true })
        .eq("tenant_id", tenant.id);
      if (countError) throw countError;

      const { data, error } = await supabase
        .from("categories")
        .insert({ nome: parsed.data.nome, ordem: count ?? 0, tenant_id: tenant.id })
        .select("id, nome, ordem")
        .single();
      if (error) throw error;
      category = data;
      showGroupingSuggestion = count === 15;
    }

    revalidatePath("/painel/categorias");
    revalidatePath(`/loja/${tenant.slug}`);
    return { data: { category, showGroupingSuggestion }, ok: true };
  } catch (error) {
    return actionError(error, "Não foi possível salvar a categoria. Verifique se o nome já existe.");
  }
}

export async function deleteCategoryAction(id: string, confirmed = false): Promise<ActionResult<{ requiresConfirmation?: boolean }>> {
  if (!z.uuid().safeParse(id).success) return { error: "Categoria inválida.", ok: false };

  try {
    const { demo, tenant } = await requireTenant();
    if (demo) return { error: "O modo de demonstração não exclui dados.", ok: false };
    const supabase = await createClient();
    const { count, error: countError } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("tenant_id", tenant.id).eq("category_id", id);
    if (countError) throw countError;

    if ((count ?? 0) > 0) {
      if (!confirmed) return { data: { requiresConfirmation: true }, ok: true };
      const { data: productImages } = await supabase.from("products").select("imagem_url").eq("tenant_id", tenant.id).eq("category_id", id);
      const { error: productError } = await supabase.from("products").delete().eq("tenant_id", tenant.id).eq("category_id", id);
      if (productError) throw productError;
      const paths = (productImages ?? []).map((product) => storagePathFromUrl(product.imagem_url)).filter((path): path is string => Boolean(path));
      if (paths.length) await supabase.storage.from("produtos").remove(paths);
    }

    const { error } = await supabase.from("categories").delete().eq("tenant_id", tenant.id).eq("id", id);
    if (error) throw error;
    revalidatePath("/painel/categorias");
    revalidatePath("/painel/produtos");
    revalidatePath(`/loja/${tenant.slug}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Não foi possível excluir a categoria.");
  }
}

function storagePathFromUrl(url: string | null) {
  if (!url) return null;
  const marker = "/storage/v1/object/public/produtos/";
  const index = url.indexOf(marker);
  return index >= 0 ? decodeURIComponent(url.slice(index + marker.length)) : null;
}

export async function reorderCategoriesAction(ids: string[]): Promise<ActionResult> {
  const parsed = z.array(z.uuid()).max(200).safeParse(ids);
  if (!parsed.success || new Set(parsed.data).size !== parsed.data.length) return { error: "Ordem inválida.", ok: false };

  try {
    const { demo, tenant } = await requireTenant();
    if (demo) return { error: "O modo de demonstração não salva a nova ordem.", ok: false };
    const supabase = await createClient();
    const { data: owned } = await supabase.from("categories").select("id").eq("tenant_id", tenant.id).in("id", parsed.data);
    if ((owned?.length ?? 0) !== parsed.data.length) return { error: "Uma categoria não pertence à sua loja.", ok: false };

    const results = await Promise.all(parsed.data.map((id, ordem) => supabase.from("categories").update({ ordem }).eq("tenant_id", tenant.id).eq("id", id)));
    const failed = results.find((result) => result.error);
    if (failed?.error) throw failed.error;

    revalidatePath("/painel/categorias");
    revalidatePath(`/loja/${tenant.slug}`);
    return { ok: true };
  } catch (error) {
    return actionError(error, "Não foi possível salvar a nova ordem.");
  }
}
