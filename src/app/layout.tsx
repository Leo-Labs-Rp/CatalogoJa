import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CatalogoJá",
    template: "%s | CatalogoJá",
  },
  description: "Sua loja no WhatsApp em minutos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
