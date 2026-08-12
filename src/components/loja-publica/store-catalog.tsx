"use client";

import { PackageOpen, Search, SearchX } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import { CategoryNav } from "@/components/loja-publica/category-nav";
import { ProductGrid } from "@/components/loja-publica/product-grid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import type { CatalogCategory } from "@/types/catalog";

const SEARCH_THRESHOLD = 12;
const STICKY_CATEGORY_THRESHOLD = 8;
const PRODUCTS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 300;

type StoreCatalogProps = {
  categories: CatalogCategory[];
  storeName: string;
  whatsapp: string;
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function StoreCatalog({ categories, storeName, whatsapp }: StoreCatalogProps) {
  const searchId = useId();
  const totalProducts = useMemo(
    () => categories.reduce((total, category) => total + category.produtos.length, 0),
    [categories],
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleByCategory, setVisibleByCategory] = useState<Record<string, number>>({});

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search);
      setVisibleByCategory({});
    }, SEARCH_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const filteredCategories = useMemo(() => {
    const term = normalizeSearch(debouncedSearch);
    if (!term) return categories;

    return categories
      .map((category) => ({
        ...category,
        produtos: category.produtos.filter((product) =>
          normalizeSearch(`${product.nome} ${product.descricao ?? ""}`).includes(term),
        ),
      }))
      .filter((category) => category.produtos.length > 0);
  }, [categories, debouncedSearch]);

  const filteredProductCount = useMemo(
    () => filteredCategories.reduce((total, category) => total + category.produtos.length, 0),
    [filteredCategories],
  );
  const showSearch = totalProducts > SEARCH_THRESHOLD;
  const stickyCategories =
    categories.length > STICKY_CATEGORY_THRESHOLD || totalProducts > SEARCH_THRESHOLD;

  function loadMore(categoryId: string, currentVisible: number) {
    setVisibleByCategory((current) => ({
      ...current,
      [categoryId]: currentVisible + PRODUCTS_PER_PAGE,
    }));
  }

  return (
    <>
      <CategoryNav categories={filteredCategories} sticky={stickyCategories} />

      <main className="mx-auto w-full max-w-[var(--content-width)] px-4 py-6 @2xl/store:px-6 @2xl/store:py-8 @5xl/store:px-8">
        <div className="mb-4 flex items-end justify-between gap-4 @2xl/store:mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--cor-primaria)]">
              Seleção da loja
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--cor-texto)] @2xl/store:text-2xl">
              Produtos em destaque
            </h2>
          </div>
          <span
            aria-live="polite"
            className="shrink-0 text-xs text-[var(--cor-texto-suave)]"
          >
            {debouncedSearch.trim()
              ? `${filteredProductCount} de ${totalProducts}`
              : totalProducts}{" "}
            {totalProducts === 1 ? "produto" : "produtos"}
          </span>
        </div>

        {showSearch ? (
          <div className="relative mb-6">
            <label className="sr-only" htmlFor={searchId}>
              Buscar produtos
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-[var(--cor-texto-suave)]"
            />
            <Input
              autoComplete="off"
              className="border-[var(--cor-borda)] bg-[var(--cor-superficie)] pl-10 text-[var(--cor-texto)] placeholder:text-[var(--cor-texto-suave)] focus:border-[var(--cor-primaria)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--cor-primaria)_18%,transparent)]"
              id={searchId}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome ou descrição"
              type="search"
              value={search}
            />
          </div>
        ) : null}

        {categories.length === 0 ? (
          <EmptyState
            description="A loja está preparando novidades. Volte em breve para conferir."
            icon={PackageOpen}
            title="Nenhum produto publicado"
          />
        ) : filteredCategories.length === 0 ? (
          <EmptyState
            description="Tente buscar por outro nome ou termo da descrição."
            icon={SearchX}
            title="Nenhum produto encontrado"
          />
        ) : (
          <div className="space-y-10">
            {filteredCategories.map((category) => {
              const visibleCount = visibleByCategory[category.id] ?? PRODUCTS_PER_PAGE;
              const visibleProducts = category.produtos.slice(0, visibleCount);
              const remainingProducts = category.produtos.length - visibleProducts.length;

              return (
                <section
                  aria-labelledby={`titulo-categoria-${category.id}`}
                  className="scroll-mt-20"
                  id={`categoria-${category.id}`}
                  key={category.id}
                >
                  <h3
                    className="mb-4 text-lg font-semibold text-[var(--cor-texto)]"
                    id={`titulo-categoria-${category.id}`}
                  >
                    {category.nome}
                  </h3>
                  <ProductGrid
                    products={visibleProducts}
                    storeName={storeName}
                    whatsapp={whatsapp}
                  />
                  {remainingProducts > 0 ? (
                    <div className="mt-5 flex justify-center">
                      <Button
                        onClick={() => loadMore(category.id, visibleCount)}
                        variant="themeSecondary"
                      >
                        Carregar mais
                      </Button>
                    </div>
                  ) : null}
                </section>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
