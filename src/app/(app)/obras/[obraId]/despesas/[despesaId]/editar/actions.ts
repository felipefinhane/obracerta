"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function atualizarDespesa(obraId: string, despesaId: string, formData: FormData) {
  const fornecedor_id = formData.get("fornecedor_id") ? String(formData.get("fornecedor_id")) : null;
  const categoria_id = formData.get("categoria_id") ? String(formData.get("categoria_id")) : null;
  const etapa_id = formData.get("etapa_id") ? String(formData.get("etapa_id")) : null;
  const data_despesa = formData.get("data_despesa") || null;
  const valorRaw = formData.get("valor");
  const valor = valorRaw ? Number(valorRaw) : null;
  const forma_pagamento = formData.get("forma_pagamento") ? String(formData.get("forma_pagamento")) : null;
  const descricao = formData.get("descricao") ? String(formData.get("descricao")) : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("despesas")
    .update({ fornecedor_id, categoria_id, etapa_id, data_despesa, valor, forma_pagamento, descricao })
    .eq("id", despesaId);

  if (error) {
    redirect(`/obras/${obraId}/despesas/${despesaId}/editar?erro=${encodeURIComponent(error.message)}`);
  }

  redirect(`/obras/${obraId}/despesas`);
}
