"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function excluirDespesa(obraId: string, despesaId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("despesas").delete().eq("id", despesaId);

  if (error) {
    redirect(`/obras/${obraId}/despesas?erro=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/obras/${obraId}/despesas`);
}
