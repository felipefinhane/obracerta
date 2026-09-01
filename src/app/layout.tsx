import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ObraCerta",
  description: "Controle de obras — planejamento, despesas e diário.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      {/* eslint-disable @next/next/no-page-custom-font -- regra pensada pro
          Pages Router (pages/_document.js); no App Router, app/layout.tsx
          é o lugar certo pra fonte global, não um caso de "só uma página" */}
      <head>
        {/* Mesmas fontes usadas nas telas do Stitch (docs/stitch/) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* eslint-enable @next/next/no-page-custom-font */}
      <body className="min-h-full flex flex-col font-body-md text-body-md">{children}</body>
    </html>
  );
}
