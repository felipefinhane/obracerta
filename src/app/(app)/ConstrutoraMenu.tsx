"use client";

import Link from "next/link";
import { useState } from "react";

const ITENS = [
  { href: "/cadastros", label: "Cadastros", icon: "inventory_2" },
  { href: "/equipe", label: "Equipe", icon: "groups" },
];

/**
 * Agrupa o que é da construtora (não de uma obra específica) num menu à
 * parte — antes ficava solto no header, competindo visualmente com Obras
 * logo na entrada do sistema (feedback do usuário em 2026-09-04).
 */
export function ConstrutoraMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary flex items-center gap-1 px-2 py-2 rounded hover:bg-surface-container transition-colors"
      >
        <span aria-hidden className="material-symbols-outlined text-[18px]">
          domain
        </span>
        <span className="hidden sm:inline">Construtora</span>
        <span aria-hidden className="material-symbols-outlined text-[18px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {open && (
        <>
          {/* backdrop pra fechar ao clicar fora, sem precisar de lib de menu */}
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 z-20 bg-surface border border-outline-variant rounded-lg shadow-lg py-1 min-w-[180px]">
            {ITENS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 font-body-md text-body-md text-on-surface hover:bg-surface-container transition-colors"
              >
                <span aria-hidden className="material-symbols-outlined text-[18px] text-on-surface-variant">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
