"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarMedicao(obraId: string, etapaId: string, formData: FormData) {
  const data = formData.get("data") || null;
  const percentualRaw = formData.get("percentual_concluido");
  const percentual_concluido = percentualRaw ? Number(percentualRaw) : null;
  const observacao = formData.get("observacao") ? String(formData.get("observacao")) : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("medicoes").insert({
    etapa_id: etapaId,
    data,
    percentual_concluido,
    observacao,
    criado_por: user?.id ?? null,
  });

  if (error) {
    // MVP: mesmo padrão do resto do app — sem tela de erro dedicada ainda,
    // só loga pra não falhar silenciosamente.
    console.error("criarMedicao falhou:", error.message);
    return;
  }

  revalidatePath(`/obras/${obraId}/etapas/${etapaId}/medicoes`);
}
