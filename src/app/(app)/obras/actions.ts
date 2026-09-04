"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarObra(formData: FormData) {
  const nome = String(formData.get("nome") ?? "");
  const construtora_id = String(formData.get("construtora_id") ?? "");
  const endereco = formData.get("endereco") ? String(formData.get("endereco")) : null;
  const cliente_nome = formData.get("cliente_nome") ? String(formData.get("cliente_nome")) : null;
  const valorRaw = formData.get("valor_planejado_total");
  const valor_planejado_total = valorRaw ? Number(valorRaw) : null;
  const data_inicio_prevista = formData.get("data_inicio_prevista") || null;
  const data_fim_prevista = formData.get("data_fim_prevista") || null;

  const supabase = await createClient();
  const { error } = await supabase.from("obras").insert({
    nome,
    construtora_id,
    endereco,
    cliente_nome,
    valor_planejado_total,
    data_inicio_prevista,
    data_fim_prevista,
  });

  if (error) {
    redirect(`/obras?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/obras");
}
