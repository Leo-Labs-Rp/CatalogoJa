import { ImageIcon, MessageCircle } from "lucide-react";
import Image from "next/image";

import { buttonVariants } from "@/components/ui";
import { formatCurrency } from "@/lib/format/currency";
import { createWhatsAppUrl } from "@/lib/whatsapp/url";
import type { CatalogProduct } from "@/types/catalog";

export type ProductCardProps = {
  product: CatalogProduct;
  storeName: string;
  whatsapp: string;
};

export function ProductCard({ product, storeName, whatsapp }: ProductCardProps) {
  const orderUrl = createWhatsAppUrl(
    whatsapp,
    `Olá! Tenho interesse no produto “${product.nome}” da ${storeName}.`,
  );

  return (
    <article className="group @container/product flex w-full min-w-0 max-w-none self-stretch flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--cor-borda)] bg-[var(--cor-superficie)] shadow-[var(--shadow-elevation)]">
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--cor-imagem-fundo)]">
        {product.imagem_url ? (
          <Image
            alt={product.nome}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
            fill
            loading="lazy"
            sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 180px"
            src={product.imagem_url}
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-[var(--cor-texto-suave)]">
            <ImageIcon aria-hidden="true" className="size-8" strokeWidth={1.5} />
            <span className="sr-only">Produto sem imagem</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3 @[14rem]/product:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-[var(--cor-texto)] @[14rem]/product:text-base">
          {product.nome}
        </h3>
        <p className="mt-1 text-base font-bold tracking-tight text-[var(--cor-primaria)] @[14rem]/product:text-lg">
          {formatCurrency(product.preco)}
        </p>

        {product.descricao ? (
          <p className="mt-2 hidden line-clamp-2 text-xs leading-5 text-[var(--cor-texto-suave)] @[14rem]/product:block">
            {product.descricao}
          </p>
        ) : null}

        {product.variacao_info ? (
          <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-[var(--cor-texto-suave)] @[14rem]/product:text-xs">
            {product.variacao_info}
          </p>
        ) : null}

        <div className="mt-auto pt-4">
          <a
            aria-label={`Pedir ${product.nome} pelo WhatsApp`}
            className={buttonVariants({ className: "w-full", size: "sm", variant: "theme" })}
            href={orderUrl}
            rel="noreferrer"
            target="_blank"
          >
            <MessageCircle aria-hidden="true" />
            Pedir
          </a>
        </div>
      </div>
    </article>
  );
}
