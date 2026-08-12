import { ProductCard } from "@/components/loja-publica/product-card";
import type { CatalogProduct } from "@/types/catalog";

export type ProductGridProps = {
  products: CatalogProduct[];
  storeName: string;
  whatsapp: string;
};

export function ProductGrid({ products, storeName, whatsapp }: ProductGridProps) {
  return (
    <div className="@container/product-grid mx-auto w-full max-w-[80rem]">
      <div className="grid w-full items-stretch gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,9rem),1fr))] @2xl/product-grid:gap-4 @5xl/product-grid:[grid-template-columns:repeat(auto-fill,minmax(min(100%,10rem),1fr))]">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            storeName={storeName}
            whatsapp={whatsapp}
          />
        ))}
      </div>
    </div>
  );
}
