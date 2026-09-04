import { ErrorBanner } from "@/components/ErrorBanner";
import { criarEtapa } from "../actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function NovaEtapaPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId } = await params;
  const { erro } = await searchParams;
  const criarEtapaNestaObra = criarEtapa.bind(null, obraId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Nova Etapa
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={criarEtapaNestaObra}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <label className={labelClass} htmlFor="nome">
          Nome da etapa
        </label>
        <input id="nome" name="nome" type="text" placeholder="Ex: Fundação" required className={inputClass} />

        <label className={labelClass} htmlFor="descricao">
          Descrição
        </label>
        <input id="descricao" name="descricao" type="text" placeholder="Opcional" className={inputClass} />

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
              placeholder="0,00"
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
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        <label className={labelClass} htmlFor="ordem">
          Ordem
        </label>
        <input id="ordem" name="ordem" type="number" min="0" step="1" placeholder="Opcional" className={inputClass} />

        <div className="grid grid-cols-2 gap-stack-sm">
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="data_inicio_prevista">
              Início previsto
            </label>
            <input id="data_inicio_prevista" name="data_inicio_prevista" type="date" className={inputClass} />
          </div>
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="data_fim_prevista">
              Fim previsto
            </label>
            <input id="data_fim_prevista" name="data_fim_prevista" type="date" className={inputClass} />
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
  );
}
