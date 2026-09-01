"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function criarConstrutora(formData: FormData) {
  const nome = String(formData.get("nome") ?? "");
  const cnpjRaw = formData.get("cnpj");
  const cnpj = cnpjRaw ? String(cnpjRaw) : null;

  const supabase = await createClient();
  const { error } = await supabase.rpc("criar_construtora", { nome, cnpj });

  if (error) {
    redirect(`/onboarding?erro=${encodeURIComponent(error.message)}`);
  }

  redirect("/obras");
}
