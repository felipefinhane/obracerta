"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function convidarMembro(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const papel = String(formData.get("papel") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("convidar_membro", { p_email: email, p_papel: papel });

  if (error) {
    redirect(`/equipe?erro=${encodeURIComponent(error.message)}`);
  }

  redirect(`/equipe?status=${data}`);
}

export async function atualizarPapelMembro(membroId: string, formData: FormData) {
  const papel = String(formData.get("papel") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.from("construtora_membros").update({ papel }).eq("id", membroId);

  if (error) {
    redirect(`/equipe?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/equipe");
}

export async function removerMembro(membroId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("construtora_membros").delete().eq("id", membroId);

  if (error) {
    redirect(`/equipe?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/equipe");
}
