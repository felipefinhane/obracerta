"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function criarCategoria(formData: FormData) {
  const construtora_id = String(formData.get("construtora_id") ?? "");
  const nome = String(formData.get("nome") ?? "");
  const tipo = String(formData.get("tipo") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.from("categorias").insert({ construtora_id, nome, tipo });

  if (error) {
    redirect(`/cadastros?erro=${encodeURIComponent(error.message)}`);
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
    redirect(`/cadastros?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/cadastros");
}
