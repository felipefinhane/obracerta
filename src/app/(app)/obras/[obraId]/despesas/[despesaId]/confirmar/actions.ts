"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function confirmarDespesa(obraId: string, despesaId: string, formData: FormData) {
  const fornecedor_id = formData.get("fornecedor_id") ? String(formData.get("fornecedor_id")) : null;
  const categoria_id = formData.get("categoria_id") ? String(formData.get("categoria_id")) : null;
  const etapa_id = formData.get("etapa_id") ? String(formData.get("etapa_id")) : null;
  const data_despesa = formData.get("data_despesa") || null;
  const valorRaw = formData.get("valor");
  const valor = valorRaw ? Number(valorRaw) : null;
  const forma_pagamento = formData.get("forma_pagamento") ? String(formData.get("forma_pagamento")) : null;
  const descricao = formData.get("descricao") ? String(formData.get("descricao")) : null;

  // Mesmo truque de src/app/obras/[obraId]/despesas/nova/actions.ts: itens
  // repetidos com o mesmo `name`, getAll preserva a ordem.
  const itemDescricoes = formData.getAll("item_descricao").map(String);
  const itemQuantidades = formData.getAll("item_quantidade").map(String);
  const itemValoresUnitarios = formData.getAll("item_valor_unitario").map(String);

  const supabase = await createClient();

  const { error } = await supabase
    .from("despesas")
    .update({
      fornecedor_id,
      categoria_id,
      etapa_id,
      valor,
      data_despesa,
      forma_pagamento,
      descricao,
      status: "confirmada",
      confirmado_em: new Date().toISOString(),
    })
    .eq("id", despesaId);

  if (error) {
    redirect(`/obras/${obraId}/despesas/${despesaId}/confirmar?erro=${encodeURIComponent(error.message)}`);
  }

  const itens = itemDescricoes
    .map((descricao, i) => {
      const quantidade = itemQuantidades[i] ? Number(itemQuantidades[i]) : null;
      const valor_unitario = itemValoresUnitarios[i] ? Number(itemValoresUnitarios[i]) : null;
      return {
        despesa_id: despesaId,
        descricao,
        quantidade,
        valor_unitario,
        valor_total: quantidade != null && valor_unitario != null ? quantidade * valor_unitario : null,
      };
    })
    .filter((item) => item.descricao.trim() !== "");

  if (itens.length > 0) {
    const { error: itensError } = await supabase.from("despesa_itens").insert(itens);
    if (itensError) {
      console.error("confirmarDespesa: itens falharam:", itensError.message);
    }
  }

  // Volta pra pendentes, não pro extrato (ticket 06) — o fluxo típico é
  // confirmar vários lançamentos acumulados em sequência (planejamento.md §3).
  redirect(`/obras/${obraId}/despesas/pendentes`);
}
