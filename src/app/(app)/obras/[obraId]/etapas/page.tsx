import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { excluirEtapa } from "./actions";
import { ExcluirEtapaForm } from "./ExcluirEtapaForm";

export default async function EtapasPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: obra } = await supabase.from("obras").select("nome").eq("id", obraId).single();
  const { data: etapas } = await supabase
    .from("etapas")
    .select("id, nome, valor_planejado, peso_percentual, ordem, data_inicio_prevista, data_fim_prevista")
    .eq("obra_id", obraId)
    .order("ordem", { nullsFirst: false })
    .order("data_inicio_prevista", { nullsFirst: false });

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        {erro && <ErrorBanner mensagem={erro} />}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Etapas — {obra?.nome ?? "Obra"}
          </h2>
          <Link
            href={`/obras/${obraId}/etapas/nova`}
            className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <span aria-hidden className="material-symbols-outlined text-[18px]">
              add
            </span>
            Nova Etapa
          </Link>
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
      </main>
    </>
  );
}
