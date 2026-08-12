import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] font-semibold transition-[background-color,border-color,color,box-shadow,filter,transform] duration-150 outline-none focus-visible:ring-3 focus-visible:ring-brand-200 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-brand-700 text-white hover:bg-brand-900",
        secondary:
          "border border-[var(--app-border)] bg-white text-[var(--app-foreground)] hover:bg-[var(--app-surface-muted)]",
        outline:
          "border border-current bg-transparent text-[var(--app-foreground)] hover:bg-black/5",
        ghost:
          "bg-transparent text-[var(--app-foreground-muted)] hover:bg-black/5 hover:text-[var(--app-foreground)]",
        theme:
          "bg-[var(--cor-acao)] text-[var(--cor-na-acao)] hover:brightness-95 focus-visible:ring-[color:var(--cor-acao)]/30",
        themeSecondary:
          "border border-[var(--cor-borda)] bg-[var(--cor-superficie)] text-[var(--cor-texto)] hover:bg-[var(--cor-imagem-fundo)] focus-visible:ring-[color:var(--cor-primaria)]/30",
        danger: "bg-[var(--app-danger)] text-white hover:brightness-95",
      },
      size: {
        sm: "h-11 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  },
);

export type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants>;

export function Button({ className, size, type = "button", variant, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ className, size, variant }))}
      type={type}
      {...props}
    />
  );
}
