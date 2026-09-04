"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarCategoria(formData: FormData) {
  const construtora_id = String(formData.get("construtora_id") ?? "");
  const nome = String(formData.get("nome") ?? "");
  const tipo = String(formData.get("tipo") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.from("categorias").insert({ construtora_id, nome, tipo });

  if (error) {
    // MVP: mesmo padrão de src/app/obras/actions.ts — sem tela de erro
    // dedicada ainda, só loga pra não falhar silenciosamente.
    console.error("criarCategoria falhou:", error.message);
    return;
  }

  revalidatePath("/cadastros");
}

export async function criarFornecedor(formData: FormData) {
  const construtora_id = String(formData.get("construtora_id") ?? "");
  const nome = String(formData.get("nome") ?? "");
  const cnpj_cpf = formData.get("cnpj_cpf") ? String(formData.get("cnpj_cpf")) : null;
  const telefone = formData.get("telefone") ? String(formData.get("telefone")) : null;

  const supabase = await createClient();
  const { error } = await supabase.from("fornecedores").insert({ construtora_id, nome, cnpj_cpf, telefone });

  if (error) {
    console.error("criarFornecedor falhou:", error.message);
    return;
  }

  revalidatePath("/cadastros");
}
