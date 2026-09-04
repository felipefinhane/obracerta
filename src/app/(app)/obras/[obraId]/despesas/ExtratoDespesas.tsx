"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { excluirDespesa } from "./actions";

type Despesa = {
  id: string;
  data_despesa: string | null;
  valor: number | null;
  forma_pagamento: string | null;
  descricao: string | null;
  categoria_id: string | null;
  fornecedor_id: string | null;
  categoria_nome: string | null;
  fornecedor_nome: string | null;
};

const FORMA_PAGAMENTO_LABEL: Record<string, string> = {
  pix: "PIX",
  boleto: "Boleto",
  cartao: "Cartão de Crédito",
  dinheiro: "Dinheiro",
  transferencia: "Transferência Bancária",
};

const selectClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface text-[12px]";

export function ExtratoDespesas({
  obraId,
  despesas,
  categorias,
  fornecedores,
}: {
  obraId: string;
  despesas: Despesa[];
  categorias: { id: string; nome: string }[];
  fornecedores: { id: string; nome: string }[];
}) {
  const [categoriaId, setCategoriaId] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Filtro client-side — volume esperado no MVP não justifica paginação/
  // filtro no servidor ainda (ticket 06 do effort).
  const filtradas = useMemo(() => {
    return despesas.filter((d) => {
      if (categoriaId && d.categoria_id !== categoriaId) return false;
      if (fornecedorId && d.fornecedor_id !== fornecedorId) return false;
      if (dataInicio && (!d.data_despesa || d.data_despesa < dataInicio)) return false;
      if (dataFim && (!d.data_despesa || d.data_despesa > dataFim)) return false;
      return true;
    });
  }, [despesas, categoriaId, fornecedorId, dataInicio, dataFim]);

  const total = filtradas.reduce((soma, d) => soma + (d.valor ?? 0), 0);

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg">
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="filtro-categoria">
            Categoria
          </label>
          <select
            id="filtro-categoria"
            className={selectClass}
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="filtro-fornecedor">
            Fornecedor
          </label>
          <select
            id="filtro-fornecedor"
            className={selectClass}
            value={fornecedorId}
            onChange={(e) => setFornecedorId(e.target.value)}
          >
            <option value="">Todos</option>
            {fornecedores.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="filtro-data-inicio">
            De
          </label>
          <input
            id="filtro-data-inicio"
            type="date"
            className={selectClass}
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className={labelClass} htmlFor="filtro-data-fim">
            Até
          </label>
          <input
            id="filtro-data-fim"
            type="date"
            className={selectClass}
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-center bg-primary-container p-stack-md rounded-lg">
        <span className="font-label-bold text-label-bold text-on-primary-container">
          Total ({filtradas.length} {filtradas.length === 1 ? "despesa" : "despesas"})
        </span>
        <span className="font-headline-md text-headline-md text-on-primary-container">
          {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </span>
      </div>

      {filtradas.length > 0 ? (
        <ul className="flex flex-col gap-stack-sm">
          {filtradas.map((d) => (
            <li
              key={d.id}
              className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md gap-stack-sm"
            >
              <div className="flex flex-col">
                <span className="text-on-surface">{d.fornecedor_nome ?? d.descricao ?? "Despesa"}</span>
                <span className="text-on-surface-variant text-[12px]">
                  {[
                    d.data_despesa ? new Date(d.data_despesa + "T00:00:00").toLocaleDateString("pt-BR") : null,
                    d.categoria_nome,
                    d.forma_pagamento ? FORMA_PAGAMENTO_LABEL[d.forma_pagamento] ?? d.forma_pagamento : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className="text-on-surface font-label-bold text-label-bold whitespace-nowrap">
                  {(d.valor ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
                <Link
                  href={`/obras/${obraId}/despesas/${d.id}/editar`}
                  aria-label="Editar despesa"
                  className="text-primary p-2 hover:bg-surface-container rounded transition-colors"
                >
                  <span aria-hidden className="material-symbols-outlined text-[18px]">
                    edit
                  </span>
                </Link>
                <form
                  action={excluirDespesa.bind(null, obraId, d.id)}
                  onSubmit={(e) => {
                    if (!confirm("Excluir esta despesa? Essa ação não pode ser desfeita.")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <button
                    type="submit"
                    aria-label="Excluir despesa"
                    className="text-error p-2 hover:bg-error-container rounded transition-colors"
                  >
                    <span aria-hidden className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma despesa encontrada.</p>
      )}
    </div>
  );
}
