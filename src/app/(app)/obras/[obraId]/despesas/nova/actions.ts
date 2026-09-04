"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function criarDespesaManual(obraId: string, formData: FormData) {
  const fornecedor_id = formData.get("fornecedor_id") ? String(formData.get("fornecedor_id")) : null;
  const categoria_id = formData.get("categoria_id") ? String(formData.get("categoria_id")) : null;
  const etapa_id = formData.get("etapa_id") ? String(formData.get("etapa_id")) : null;
  const data_despesa = formData.get("data_despesa") || null;
  const valorRaw = formData.get("valor");
  const valor = valorRaw ? Number(valorRaw) : null;
  const forma_pagamento = formData.get("forma_pagamento") ? String(formData.get("forma_pagamento")) : null;
  const descricao = formData.get("descricao") ? String(formData.get("descricao")) : null;

  // Itens são repetidos com o mesmo `name` (sem JS pra indexar dinamicamente,
  // mesmo espírito simples dos outros forms do MVP) — getAll preserva a
  // ordem em que apareceram no HTML, então os três arrays casam por índice.
  const itemDescricoes = formData.getAll("item_descricao").map(String);
  const itemQuantidades = formData.getAll("item_quantidade").map(String);
  const itemValoresUnitarios = formData.getAll("item_valor_unitario").map(String);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: despesa, error } = await supabase
    .from("despesas")
    .insert({
      obra_id: obraId,
      origem: "manual",
      status: "confirmada",
      confirmado_em: new Date().toISOString(),
      criado_por: user?.id ?? null,
      fornecedor_id,
      categoria_id,
      etapa_id,
      valor,
      data_despesa,
      forma_pagamento,
      descricao,
    })
    .select("id")
    .single();

  if (error || !despesa) {
    redirect(`/obras/${obraId}/despesas/nova?erro=${encodeURIComponent(error?.message ?? "falha ao criar despesa")}`);
  }

  const itens = itemDescricoes
    .map((descricao, i) => {
      const quantidade = itemQuantidades[i] ? Number(itemQuantidades[i]) : null;
      const valor_unitario = itemValoresUnitarios[i] ? Number(itemValoresUnitarios[i]) : null;
      return {
        despesa_id: despesa.id,
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
      console.error("criarDespesaManual: itens falharam:", itensError.message);
    }
  }

  redirect(`/obras/${obraId}/despesas`);
}
