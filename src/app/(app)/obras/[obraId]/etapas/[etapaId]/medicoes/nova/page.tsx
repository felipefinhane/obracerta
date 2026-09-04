import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarMedicao } from "../actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function NovaMedicaoPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string; etapaId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId, etapaId } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();
  const { data: etapa } = await supabase.from("etapas").select("nome").eq("id", etapaId).single();
  const criarMedicaoNestaEtapa = criarMedicao.bind(null, obraId, etapaId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Nova Medição — {etapa?.nome ?? "Etapa"}
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={criarMedicaoNestaEtapa}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <div className="grid grid-cols-2 gap-stack-sm">
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="data">
              Data
            </label>
            <input
              id="data"
              name="data"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="percentual_concluido">
              % Concluído
            </label>
            <input
              id="percentual_concluido"
              name="percentual_concluido"
              type="number"
              min="0"
              max="100"
              step="0.01"
              required
              className={inputClass}
            />
          </div>
        </div>
        <label className={labelClass} htmlFor="observacao">
          Observação
        </label>
        <input id="observacao" name="observacao" type="text" placeholder="Opcional" className={inputClass} />
        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Registrar medição
        </button>
      </form>
    </main>
  );
}
