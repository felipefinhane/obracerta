"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarRecebimento(obraId: string, formData: FormData) {
  const tipo = String(formData.get("tipo") ?? "");
  const valorRaw = formData.get("valor");
  const valor = valorRaw ? Number(valorRaw) : null;
  const data = formData.get("data") || null;
  const etapa_id = formData.get("etapa_id") ? String(formData.get("etapa_id")) : null;
  const descricao = formData.get("descricao") ? String(formData.get("descricao")) : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("recebimentos").insert({
    obra_id: obraId,
    etapa_id,
    tipo,
    valor,
    data,
    descricao,
    criado_por: user?.id ?? null,
  });

  if (error) {
    redirect(`/obras/${obraId}/recebimentos?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/obras/${obraId}/recebimentos`);
}
