import { createClient } from "@/lib/supabase/server";
import { NovoLancamentoForm } from "./NovoLancamentoForm";

export default async function NovoLancamentoPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: etapas } = await supabase.from("etapas").select("id, nome").eq("obra_id", obraId).order("nome");

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Novo Lançamento
      </h2>
      <NovoLancamentoForm obraId={obraId} etapas={etapas ?? []} />
    </main>
  );
}
