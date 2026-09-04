import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { criarEtapa, excluirEtapa } from "./actions";
import { ExcluirEtapaForm } from "./ExcluirEtapaForm";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function EtapasPage({ params }: { params: Promise<{ obraId: string }> }) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: obra } = await supabase.from("obras").select("nome").eq("id", obraId).single();
  const { data: etapas } = await supabase
    .from("etapas")
    .select("id, nome, valor_planejado, peso_percentual, ordem, data_inicio_prevista, data_fim_prevista")
    .eq("obra_id", obraId)
    .order("ordem", { nullsFirst: false })
    .order("data_inicio_prevista", { nullsFirst: false });

  const criarEtapaNestaObra = criarEtapa.bind(null, obraId);

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Etapas — {obra?.nome ?? "Obra"}
          </h2>
        </div>

        {etapas && etapas.length > 0 ? (
          <ul className="flex flex-col gap-stack-sm">
            {etapas.map((e) => (
              <li
                key={e.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md gap-stack-sm"
              >
                <div className="flex flex-col">
                  <span className="text-on-surface">{e.nome}</span>
                  <span className="text-on-surface-variant text-[12px]">
                    {[
                      e.valor_planejado != null &&
                        e.valor_planejado.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                      e.peso_percentual != null && `${e.peso_percentual}%`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/obras/${obraId}/etapas/${e.id}/medicoes`}
                    className="text-primary font-button-text text-button-text flex items-center gap-1 p-2 hover:bg-surface-container rounded transition-colors"
                  >
                    <span aria-hidden className="material-symbols-outlined text-[18px]">
                      timeline
                    </span>
                  </Link>
                  <Link
                    href={`/obras/${obraId}/etapas/${e.id}/editar`}
                    aria-label={`Editar etapa ${e.nome}`}
                    className="text-primary font-button-text text-button-text flex items-center gap-1 p-2 hover:bg-surface-container rounded transition-colors"
                  >
                    <span aria-hidden className="material-symbols-outlined text-[18px]">
                      edit
                    </span>
                  </Link>
                  <ExcluirEtapaForm action={excluirEtapa.bind(null, obraId, e.id)} etapaNome={e.nome} />
                </div>
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
    </>
  );
}
