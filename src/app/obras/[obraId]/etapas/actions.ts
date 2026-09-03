"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function lerCamposEtapa(formData: FormData) {
  const nome = String(formData.get("nome") ?? "");
  const descricao = formData.get("descricao") ? String(formData.get("descricao")) : null;
  const valorRaw = formData.get("valor_planejado");
  const valor_planejado = valorRaw ? Number(valorRaw) : null;
  const pesoRaw = formData.get("peso_percentual");
  const peso_percentual = pesoRaw ? Number(pesoRaw) : null;
  const ordemRaw = formData.get("ordem");
  const ordem = ordemRaw ? Number(ordemRaw) : null;
  const data_inicio_prevista = formData.get("data_inicio_prevista") || null;
  const data_fim_prevista = formData.get("data_fim_prevista") || null;

  return { nome, descricao, valor_planejado, peso_percentual, ordem, data_inicio_prevista, data_fim_prevista };
}

export async function criarEtapa(obraId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("etapas").insert({ obra_id: obraId, ...lerCamposEtapa(formData) });

  if (error) {
    // MVP: mesmo padrão de src/app/obras/actions.ts — sem tela de erro
    // dedicada ainda, só loga pra não falhar silenciosamente.
    console.error("criarEtapa falhou:", error.message);
    return;
  }

  revalidatePath(`/obras/${obraId}/etapas`);
}

export async function atualizarEtapa(obraId: string, etapaId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("etapas").update(lerCamposEtapa(formData)).eq("id", etapaId);

  if (error) {
    console.error("atualizarEtapa falhou:", error.message);
    return;
  }

  redirect(`/obras/${obraId}/etapas`);
}

export async function excluirEtapa(obraId: string, etapaId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("etapas").delete().eq("id", etapaId);

  if (error) {
    console.error("excluirEtapa falhou:", error.message);
    return;
  }

  revalidatePath(`/obras/${obraId}/etapas`);
}
