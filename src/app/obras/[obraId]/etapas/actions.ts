"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarEtapa(obraId: string, formData: FormData) {
  const nome = String(formData.get("nome") ?? "");
  const valorRaw = formData.get("valor_planejado");
  const valor_planejado = valorRaw ? Number(valorRaw) : null;
  const data_inicio_prevista = formData.get("data_inicio_prevista") || null;
  const data_fim_prevista = formData.get("data_fim_prevista") || null;

  const supabase = await createClient();
  const { error } = await supabase.from("etapas").insert({
    obra_id: obraId,
    nome,
    valor_planejado,
    data_inicio_prevista,
    data_fim_prevista,
  });

  if (error) {
    // MVP: mesmo padrão de src/app/obras/actions.ts — sem tela de erro
    // dedicada ainda, só loga pra não falhar silenciosamente.
    console.error("criarEtapa falhou:", error.message);
    return;
  }

  revalidatePath(`/obras/${obraId}/etapas`);
}
