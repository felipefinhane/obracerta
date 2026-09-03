"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Cria o lançamento provisório (ADR 0002 decisão 4): `despesas` +
 * `recibos` são inseridos ANTES do upload da foto, com caminho
 * determinístico no R2 (`recibos/{recibo_id}.jpg`) já conhecido — o `id`
 * do recibo é gerado aqui (não pelo default do banco) porque precisa entrar
 * no mesmo INSERT que grava `arquivo_url`.
 */
export async function criarLancamentoProvisorio(
  obraId: string,
): Promise<{ despesaId: string; reciboId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: despesa, error: despesaError } = await supabase
    .from("despesas")
    .insert({
      obra_id: obraId,
      origem: "foto",
      status: "pendente_confirmacao",
      criado_por: user?.id ?? null,
    })
    .select("id")
    .single();

  if (despesaError || !despesa) {
    return { error: despesaError?.message ?? "falha ao criar despesa" };
  }

  const reciboId = crypto.randomUUID();
  const { error: reciboError } = await supabase.from("recibos").insert({
    id: reciboId,
    despesa_id: despesa.id,
    arquivo_url: `recibos/${reciboId}.jpg`,
    status_processamento: "aguardando_upload",
  });

  if (reciboError) {
    return { error: reciboError.message };
  }

  return { despesaId: despesa.id, reciboId };
}

/**
 * Chamado só depois do upload pro R2 confirmar (2xx). É essa transição que
 * dispara a Edge Function de extração via Database Webhook (ADR 0002,
 * revisão) — nunca no INSERT, porque o arquivo ainda não existe no Storage
 * nesse momento.
 */
export async function confirmarUploadRecibo(reciboId: string): Promise<{ ok: true } | { error: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("recibos")
    .update({ status_processamento: "pendente" })
    .eq("id", reciboId);

  if (error) {
    return { error: error.message };
  }

  return { ok: true };
}
