"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function criarCategoria(formData: FormData) {
  const construtora_id = String(formData.get("construtora_id") ?? "");
  const nome = String(formData.get("nome") ?? "");
  const tipo = String(formData.get("tipo") ?? "");
  const categoria_pai_id = formData.get("categoria_pai_id") ? String(formData.get("categoria_pai_id")) : null;

  const supabase = await createClient();
  const { error } = await supabase.from("categorias").insert({ construtora_id, nome, tipo, categoria_pai_id });

  if (error) {
    redirect(`/cadastros/categorias/nova?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/cadastros");
}

export async function criarFornecedor(formData: FormData) {
  const construtora_id = String(formData.get("construtora_id") ?? "");
  const nome = String(formData.get("nome") ?? "");
  const cnpj_cpf = formData.get("cnpj_cpf") ? String(formData.get("cnpj_cpf")) : null;
  const telefone = formData.get("telefone") ? String(formData.get("telefone")) : null;

  const supabase = await createClient();
  const { error } = await supabase.from("fornecedores").insert({ construtora_id, nome, cnpj_cpf, telefone });

  if (error) {
    redirect(`/cadastros/fornecedores/nova?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/cadastros");
}
