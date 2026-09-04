"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

/**
 * Menu de verdade (dropdown), não mais uma faixa de abas horizontais — com
 * 8 seções, a faixa exigia rolagem horizontal no celular e não parecia um
 * "menu" de navegação (feedback do usuário em 2026-09-04).
 */
export function ObraMenu({ obraId }: { obraId: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const itens = [
    { href: `/obras/${obraId}/despesas`, label: "Despesas", icon: "receipt_long" },
    { href: `/obras/${obraId}/etapas`, label: "Etapas", icon: "list_alt" },
    { href: `/obras/${obraId}/orcado-realizado`, label: "Orçado x Realizado", icon: "insights" },
    { href: `/obras/${obraId}/diario`, label: "Diário de Obra", icon: "menu_book" },
    { href: `/obras/${obraId}/recebimentos`, label: "Recebimentos", icon: "payments" },
    { href: `/obras/${obraId}/fluxo-de-caixa`, label: "Fluxo de Caixa", icon: "account_balance" },
    { href: `/obras/${obraId}/conciliacao`, label: "Conciliação Bancária", icon: "sync_alt" },
    { href: `/obras/${obraId}/equipe`, label: "Equipe da Obra", icon: "group" },
  ];

  const atual = itens.find((i) => pathname?.startsWith(i.href));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full sm:w-auto h-touch-target-min px-3 flex items-center gap-2 border border-outline rounded bg-surface-bright text-on-surface font-label-bold text-label-bold hover:bg-surface-container transition-colors"
      >
        <span aria-hidden className="material-symbols-outlined text-[18px] text-primary">
          menu
        </span>
        <span className="flex-1 sm:flex-initial text-left">{atual?.label ?? "Menu da obra"}</span>
        <span aria-hidden className="material-symbols-outlined text-[18px] text-on-surface-variant">
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
          <div className="absolute left-0 top-full mt-1 z-20 bg-surface border border-outline-variant rounded-lg shadow-lg py-1 min-w-[240px] max-h-[70vh] overflow-y-auto">
            {itens.map((item) => {
              const ativo = item.href === atual?.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 font-body-md text-body-md transition-colors ${
                    ativo
                      ? "bg-primary-container text-on-primary-container"
                      : "text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`material-symbols-outlined text-[18px] ${ativo ? "" : "text-on-surface-variant"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
