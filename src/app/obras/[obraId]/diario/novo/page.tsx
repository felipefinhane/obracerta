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
    <div className="min-h-screen bg-background text-on-background">
      <header className="bg-surface border-b border-outline-variant flex items-center px-margin-mobile h-touch-target-min">
        <h1 className="font-headline-md text-headline-md text-primary">Novo Lançamento</h1>
      </header>

      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
        <NovoLancamentoForm obraId={obraId} etapas={etapas ?? []} />
      </main>
    </div>
  );
}
