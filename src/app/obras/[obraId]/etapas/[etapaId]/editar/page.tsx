import { createClient } from "@/lib/supabase/server";
import { atualizarEtapa } from "../../actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function EditarEtapaPage({
  params,
}: {
  params: Promise<{ obraId: string; etapaId: string }>;
}) {
  const { obraId, etapaId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: etapa } = await supabase
    .from("etapas")
    .select("nome, descricao, valor_planejado, peso_percentual, ordem, data_inicio_prevista, data_fim_prevista")
    .eq("id", etapaId)
    .single();

  const atualizarEstaEtapa = atualizarEtapa.bind(null, obraId, etapaId);

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="bg-surface border-b border-outline-variant flex items-center px-margin-mobile h-touch-target-min">
        <h1 className="font-headline-md text-headline-md text-primary">Editar Etapa</h1>
      </header>

      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
        <form
          action={atualizarEstaEtapa}
          className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
        >
          <label className={labelClass} htmlFor="nome">
            Nome da etapa
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            defaultValue={etapa?.nome ?? ""}
            required
            className={inputClass}
          />

          <label className={labelClass} htmlFor="descricao">
            Descrição
          </label>
          <input
            id="descricao"
            name="descricao"
            type="text"
            defaultValue={etapa?.descricao ?? ""}
            className={inputClass}
          />

          <div className="grid grid-cols-2 gap-stack-sm">
            <div className="flex flex-col gap-stack-sm">
              <label className={labelClass} htmlFor="valor_planejado">
                Valor planejado (R$)
              </label>
              <input
                id="valor_planejado"
                name="valor_planejado"
                type="number"
                min="0"
                step="0.01"
                defaultValue={etapa?.valor_planejado ?? ""}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-stack-sm">
              <label className={labelClass} htmlFor="peso_percentual">
                Peso (%)
              </label>
              <input
                id="peso_percentual"
                name="peso_percentual"
                type="number"
                min="0"
                max="100"
                step="0.01"
                defaultValue={etapa?.peso_percentual ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <label className={labelClass} htmlFor="ordem">
            Ordem
          </label>
          <input
            id="ordem"
            name="ordem"
            type="number"
            min="0"
            step="1"
            defaultValue={etapa?.ordem ?? ""}
            className={inputClass}
          />

          <div className="grid grid-cols-2 gap-stack-sm">
            <div className="flex flex-col gap-stack-sm">
              <label className={labelClass} htmlFor="data_inicio_prevista">
                Início previsto
              </label>
              <input
                id="data_inicio_prevista"
                name="data_inicio_prevista"
                type="date"
                defaultValue={etapa?.data_inicio_prevista ?? ""}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-stack-sm">
              <label className={labelClass} htmlFor="data_fim_prevista">
                Fim previsto
              </label>
              <input
                id="data_fim_prevista"
                name="data_fim_prevista"
                type="date"
                defaultValue={etapa?.data_fim_prevista ?? ""}
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
          >
            Salvar alterações
          </button>
        </form>
      </main>
    </div>
  );
}
