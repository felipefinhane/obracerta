import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { importarExtrato, vincularTransacao } from "./actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

function formatarMoeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function ConciliacaoPage({
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
  const { data: transacoesRaw } = await supabase
    .from("transacoes_bancarias")
    .select("id, data, descricao, valor, despesa_id, recebimento_id, despesas(descricao), recebimentos(descricao)")
    .eq("obra_id", obraId)
    .order("data", { ascending: false });

  const { data: despesas } = await supabase
    .from("despesas")
    .select("id, descricao, valor")
    .eq("obra_id", obraId)
    .eq("status", "confirmada")
    .order("data_despesa", { ascending: false });

  const { data: recebimentos } = await supabase
    .from("recebimentos")
    .select("id, descricao, tipo, valor")
    .eq("obra_id", obraId)
    .order("data", { ascending: false });

  const transacoes = (transacoesRaw ?? []).map((t) => {
    const despesa = Array.isArray(t.despesas) ? t.despesas[0] : t.despesas;
    const recebimento = Array.isArray(t.recebimentos) ? t.recebimentos[0] : t.recebimentos;
    return { ...t, vinculoDescricao: despesa?.descricao ?? recebimento?.descricao ?? null };
  });

  const importarExtratoNestaObra = importarExtrato.bind(null, obraId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-3xl mx-auto">
      <div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Conciliação Bancária
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Importe um extrato em CSV (colunas: data, descrição, valor — positivo para entrada, negativo para
          saída) e vincule cada linha a uma despesa ou recebimento já lançado.
        </p>
      </div>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={importarExtratoNestaObra}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <input type="file" name="arquivo" accept=".csv,text/csv" required className="font-body-md text-body-md" />
        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity flex-shrink-0"
        >
          Importar
        </button>
      </form>

      {transacoes.length > 0 ? (
        <ul className="flex flex-col gap-stack-sm">
          {transacoes.map((t) => (
            <li
              key={t.id}
              className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-stack-sm font-body-md text-body-md"
            >
              <div className="flex flex-col">
                <span className="text-on-surface">{t.descricao || "(sem descrição)"}</span>
                <span className="text-on-surface-variant text-[12px]">
                  {new Date(t.data + "T00:00:00").toLocaleDateString("pt-BR")} ·{" "}
                  <span className={t.valor < 0 ? "text-error" : "text-on-surface-variant"}>
                    {formatarMoeda(t.valor)}
                  </span>
                </span>
              </div>

              {t.vinculoDescricao ? (
                <span className="text-primary text-[12px] flex items-center gap-1">
                  <span aria-hidden className="material-symbols-outlined text-[16px]">
                    link
                  </span>
                  {t.vinculoDescricao}
                </span>
              ) : (
                <form action={vincularTransacao.bind(null, obraId, t.id)} className="flex items-center gap-1">
                  <select name="vinculo" defaultValue="" className={`${inputClass} text-[12px]`} required>
                    <option value="" disabled>
                      Vincular a...
                    </option>
                    {despesas && despesas.length > 0 && (
                      <optgroup label="Despesas">
                        {despesas.map((d) => (
                          <option key={d.id} value={`despesa:${d.id}`}>
                            {d.descricao || "Despesa"} ({formatarMoeda(d.valor ?? 0)})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {recebimentos && recebimentos.length > 0 && (
                      <optgroup label="Recebimentos">
                        {recebimentos.map((r) => (
                          <option key={r.id} value={`recebimento:${r.id}`}>
                            {r.descricao || r.tipo} ({formatarMoeda(r.valor)})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                  <button
                    type="submit"
                    className="font-label-bold text-label-bold text-primary text-[12px] px-2 py-1 hover:bg-surface-container rounded transition-colors"
                  >
                    Vincular
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma transação importada ainda.</p>
      )}
    </main>
  );
}
