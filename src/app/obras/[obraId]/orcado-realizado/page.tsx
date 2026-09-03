import { createClient } from "@/lib/supabase/server";

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function OrcadoRealizadoPage({
  params,
}: {
  params: Promise<{ obraId: string }>;
}) {
  const { obraId } = await params;
  const supabase = await createClient();

  // RLS já filtra (view com security_invoker=true reusa has_obra_access de
  // etapas/despesas — fundacao-tecnica/06) — sem lógica extra aqui.
  const { data: obra } = await supabase.from("obras").select("nome").eq("id", obraId).single();

  const [{ data: porEtapa }, { data: despesasSemEtapa }] = await Promise.all([
    supabase
      .from("orcado_vs_realizado")
      .select("etapa_id, etapa_nome, valor_planejado, valor_realizado")
      .eq("obra_id", obraId)
      .order("etapa_nome"),
    // A view soma por etapa — despesa confirmada sem etapa_id vinculado
    // fica de fora dela, mas ainda é gasto real da obra (spec.md).
    supabase.from("despesas").select("valor").eq("obra_id", obraId).eq("status", "confirmada").is("etapa_id", null),
  ]);

  const realizadoSemEtapa = (despesasSemEtapa ?? []).reduce((soma, d) => soma + (d.valor ?? 0), 0);
  const totalPlanejado = (porEtapa ?? []).reduce((soma, e) => soma + (e.valor_planejado ?? 0), 0);
  const totalRealizado =
    (porEtapa ?? []).reduce((soma, e) => soma + (e.valor_realizado ?? 0), 0) + realizadoSemEtapa;
  const percentualConsolidado = totalPlanejado > 0 ? (totalRealizado / totalPlanejado) * 100 : null;

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="bg-surface border-b border-outline-variant flex items-center px-margin-mobile h-touch-target-min">
        <h1 className="font-headline-md text-headline-md text-primary">ObraCerta</h1>
      </header>

      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Orçado x Realizado — {obra?.nome ?? "Obra"}
        </h2>

        <div className="bg-primary-container p-stack-lg rounded-lg flex flex-col gap-stack-sm">
          <span className="font-label-bold text-label-bold text-on-primary-container uppercase tracking-wider text-[12px]">
            Custo Total Consolidado
          </span>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-stack-sm">
            <span className="font-headline-lg text-headline-lg text-on-primary-container">
              {formatarMoeda(totalRealizado)}
            </span>
            <span className="font-body-md text-body-md text-on-primary-container opacity-80">
              de {formatarMoeda(totalPlanejado)} planejado
              {percentualConsolidado != null && ` (${percentualConsolidado.toFixed(0)}%)`}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-stack-sm">
          <h3 className="font-headline-md text-headline-md text-primary border-b-2 border-outline-variant pb-2">
            Detalhamento por Etapa
          </h3>

          {porEtapa && porEtapa.length > 0 ? (
            <ul className="flex flex-col gap-stack-sm">
              {porEtapa.map((e) => {
                const planejado = e.valor_planejado ?? 0;
                const realizado = e.valor_realizado ?? 0;
                const percentual = planejado > 0 ? (realizado / planejado) * 100 : null;
                const estourou = planejado > 0 && realizado > planejado;

                return (
                  <li
                    key={e.etapa_id}
                    className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex flex-col gap-2 font-body-md text-body-md"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface">{e.etapa_nome}</span>
                      <span className={`font-label-bold text-label-bold ${estourou ? "text-error" : "text-on-surface"}`}>
                        {formatarMoeda(realizado)}
                        {planejado > 0 && (
                          <span className="text-on-surface-variant font-body-md text-body-md"> / {formatarMoeda(planejado)}</span>
                        )}
                      </span>
                    </div>
                    {planejado > 0 && (
                      <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div
                          className={`h-full ${estourou ? "bg-error" : "bg-primary"}`}
                          style={{ width: `${Math.min(percentual ?? 0, 100)}%` }}
                        />
                      </div>
                    )}
                    {estourou && (
                      <span className="text-error text-[12px]">Estourou o planejado</span>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma etapa cadastrada ainda.</p>
          )}

          {realizadoSemEtapa > 0 && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md">
              <span className="text-on-surface-variant">Sem etapa vinculada</span>
              <span className="text-on-surface font-label-bold text-label-bold">{formatarMoeda(realizadoSemEtapa)}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
