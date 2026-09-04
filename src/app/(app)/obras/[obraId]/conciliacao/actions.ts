"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Parser de CSV minimalista de propósito (spec.md: só CSV nesta v1, sem
 * OFX) — espera exatamente três colunas (data, descricao, valor), com
 * cabeçalho na primeira linha. Sem suporte a campo com vírgula entre aspas;
 * suficiente pro objetivo (bater extrato contra lançamento), não é um
 * parser de CSV genérico.
 */
function parseCsv(texto: string): { data: string; descricao: string; valor: number }[] {
  const linhas = texto.split(/\r?\n/).filter((l) => l.trim() !== "");
  const linhasDados = linhas.slice(1); // pula o cabeçalho

  return linhasDados
    .map((linha) => {
      const [data, descricao, valorRaw] = linha.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
      return { data, descricao, valor: Number(valorRaw) };
    })
    .filter((t) => t.data && !Number.isNaN(t.valor));
}

export async function importarExtrato(obraId: string, formData: FormData) {
  const arquivo = formData.get("arquivo");

  if (!(arquivo instanceof File) || arquivo.size === 0) {
    redirect(`/obras/${obraId}/conciliacao/importar?erro=${encodeURIComponent("selecione um arquivo CSV")}`);
  }

  const texto = await (arquivo as File).text();
  const transacoes = parseCsv(texto);

  if (transacoes.length === 0) {
    redirect(
      `/obras/${obraId}/conciliacao/importar?erro=${encodeURIComponent("nenhuma linha válida encontrada no CSV (esperado: data,descricao,valor)")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("transacoes_bancarias")
    .insert(transacoes.map((t) => ({ obra_id: obraId, ...t })));

  if (error) {
    redirect(`/obras/${obraId}/conciliacao/importar?erro=${encodeURIComponent(error.message)}`);
  }

  redirect(`/obras/${obraId}/conciliacao`);
}

export async function vincularTransacao(obraId: string, transacaoId: string, formData: FormData) {
  const vinculo = String(formData.get("vinculo") ?? "");
  const [tipo, id] = vinculo.split(":");

  const supabase = await createClient();
  const { error } = await supabase
    .from("transacoes_bancarias")
    .update({
      despesa_id: tipo === "despesa" ? id : null,
      recebimento_id: tipo === "recebimento" ? id : null,
    })
    .eq("id", transacaoId);

  if (error) {
    redirect(`/obras/${obraId}/conciliacao?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/obras/${obraId}/conciliacao`);
}
