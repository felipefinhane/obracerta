"use server";

import { redirect } from "next/navigation";
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
    redirect(`/obras/${obraId}/etapas/${etapaId}/medicoes/nova?erro=${encodeURIComponent(error.message)}`);
  }

  redirect(`/obras/${obraId}/etapas/${etapaId}/medicoes`);
}
