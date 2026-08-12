import { Store } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils/cn";

export type StoreLogoProps = {
  className?: string;
  logoUrl: string | null;
  storeName: string;
};

export function StoreLogo({ className, logoUrl, storeName }: StoreLogoProps) {
  return (
    <div
      className={cn(
        "relative grid aspect-square size-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-[var(--cor-superficie)] bg-[var(--cor-imagem-fundo)] text-[var(--cor-primaria)] shadow-[var(--shadow-elevation)]",
        className,
      )}
    >
      {logoUrl ? (
        <Image
          alt={`Logo da ${storeName}`}
          className="object-cover"
          fill
          loading="lazy"
          sizes="64px"
          src={logoUrl}
        />
      ) : (
        <Store aria-hidden="true" className="size-6" strokeWidth={1.8} />
      )}
    </div>
  );
}
