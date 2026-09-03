import { createClient } from "@/lib/supabase/server";
import { criarEtapa } from "./actions";

export default async function EtapasPage({ params }: { params: Promise<{ obraId: string }> }) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: obra } = await supabase.from("obras").select("nome").eq("id", obraId).single();
  const { data: etapas } = await supabase
    .from("etapas")
    .select("id, nome, valor_planejado, data_inicio_prevista, data_fim_prevista")
    .eq("obra_id", obraId)
    .order("data_inicio_prevista", { nullsFirst: false });

  const criarEtapaNestaObra = criarEtapa.bind(null, obraId);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="bg-surface border-b border-outline-variant flex items-center px-margin-mobile h-touch-target-min">
        <h1 className="font-headline-md text-headline-md text-primary">ObraCerta</h1>
      </header>

      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Etapas — {obra?.nome ?? "Obra"}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Cadastro mínimo de etapas — vinculação com despesas e orçado x realizado ficam pro módulo de Planejamento.
          </p>
        </div>

        {etapas && etapas.length > 0 ? (
          <ul className="flex flex-col gap-stack-sm">
            {etapas.map((e) => (
              <li
                key={e.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md"
              >
                <span className="text-on-surface">{e.nome}</span>
                <span className="text-on-surface-variant text-[12px]">
                  {e.valor_planejado != null &&
                    e.valor_planejado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma etapa ainda.</p>
        )}

        <form
          action={criarEtapaNestaObra}
          className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg max-w-md"
        >
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="nome">
            Nome da etapa
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Ex: Fundação"
            required
            className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <label className="font-label-bold text-label-bold text-on-surface" htmlFor="valor_planejado">
            Valor planejado (R$)
          </label>
          <input
            id="valor_planejado"
            name="valor_planejado"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <div className="grid grid-cols-2 gap-stack-sm">
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="data_inicio_prevista">
                Início previsto
              </label>
              <input
                id="data_inicio_prevista"
                name="data_inicio_prevista"
                type="date"
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="data_fim_prevista">
                Fim previsto
              </label>
              <input
                id="data_fim_prevista"
                name="data_fim_prevista"
                type="date"
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
          >
            Adicionar etapa
          </button>
        </form>
      </main>
    </div>
  );
}
