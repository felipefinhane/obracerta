"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function convidarClienteObra(obraId: string, formData: FormData) {
  const email = String(formData.get("email") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("convidar_membro", {
    p_email: email,
    p_papel: "cliente",
    p_obra_id: obraId,
  });

  if (error) {
    redirect(`/obras/${obraId}/equipe/novo?erro=${encodeURIComponent(error.message)}`);
  }

  redirect(`/obras/${obraId}/equipe?status=${data}`);
}

export async function removerClienteObra(obraId: string, membroId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("obra_membros").delete().eq("id", membroId);

  if (error) {
    redirect(`/obras/${obraId}/equipe?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/obras/${obraId}/equipe`);
}
