"use server";

import { createClient } from "@/lib/supabase/server";

export async function criarEntradaDiario(
  obraId: string,
  formData: FormData,
): Promise<{ entradaId: string } | { error: string }> {
  const data = formData.get("data") || null;
  const clima = formData.get("clima") ? String(formData.get("clima")) : null;
  const descricao = formData.get("descricao") ? String(formData.get("descricao")) : null;
  const efetivoRaw = formData.get("efetivo_presente");
  const efetivo_presente = efetivoRaw ? Number(efetivoRaw) : null;
  const ocorrencias = formData.get("ocorrencias") ? String(formData.get("ocorrencias")) : null;
  const etapa_id = formData.get("etapa_id") ? String(formData.get("etapa_id")) : null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entrada, error } = await supabase
    .from("diario_entradas")
    .insert({
      obra_id: obraId,
      etapa_id,
      data,
      clima,
      descricao,
      efetivo_presente,
      ocorrencias,
      criado_por: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !entrada) {
    return { error: error?.message ?? "falha ao criar lançamento" };
  }

  return { entradaId: entrada.id };
}

/**
 * Cria a linha de mídia com caminho determinístico no R2 (mesmo esquema de
 * `recibos.arquivo_url`, ADR 0003) — sem a dança de `status_processamento`
 * dos recibos, porque não tem pipeline assíncrono lendo essa foto depois.
 */
export async function criarMidiaDiario(entradaId: string): Promise<{ midiaId: string } | { error: string }> {
  const supabase = await createClient();
  const midiaId = crypto.randomUUID();

  const { error } = await supabase.from("diario_midia").insert({
    id: midiaId,
    diario_entrada_id: entradaId,
    arquivo_url: `diario/${midiaId}.jpg`,
    tipo: "foto",
  });

  if (error) {
    return { error: error.message };
  }

  return { midiaId };
}
