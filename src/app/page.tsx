import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Ponto de entrada pós-login. Middleware (ticket 03) já garante sessão
 * válida pra chegar aqui. Se o usuário não tem nenhuma construtora ainda,
 * manda pro onboarding (ticket 05); senão, pra listagem de Obras (ticket 06).
 */
export default async function Home() {
  const supabase = await createClient();

  const { count } = await supabase
    .from("construtora_membros")
    .select("id", { count: "exact", head: true });

  if (!count) {
    redirect("/onboarding");
  }

  redirect("/obras");
}
