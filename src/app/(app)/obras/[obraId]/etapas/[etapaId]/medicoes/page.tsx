import { createClient } from "@/lib/supabase/server";
import { criarMedicao } from "./actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function MedicoesPage({
  params,
}: {
  params: Promise<{ obraId: string; etapaId: string }>;
}) {
  const { obraId, etapaId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access, via etapas) — sem lógica extra de
  // autorização aqui.
  const { data: etapa } = await supabase.from("etapas").select("nome").eq("id", etapaId).single();
  const { data: medicoes } = await supabase
    .from("medicoes")
    .select("id, data, percentual_concluido, observacao")
    .eq("etapa_id", etapaId)
    .order("data", { ascending: false });

  const criarMedicaoNestaEtapa = criarMedicao.bind(null, obraId, etapaId);

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Medições — {etapa?.nome ?? "Etapa"}
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
          Medição simplificada — sem fluxo de aprovação nesta versão.
        </p>

        {medicoes && medicoes.length > 0 ? (
          <ul className="flex flex-col gap-stack-sm">
            {medicoes.map((m) => (
              <li
                key={m.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-3 font-body-md text-body-md"
              >
                <div className="flex justify-between items-center">
                  <span className="text-on-surface">
                    {new Date(m.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                  <span className="text-primary font-label-bold text-label-bold">{m.percentual_concluido}%</span>
                </div>
                {m.observacao && (
                  <p className="text-on-surface-variant text-[12px] mt-1">{m.observacao}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma medição lançada ainda.</p>
        )}

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
    </>
  );
}
