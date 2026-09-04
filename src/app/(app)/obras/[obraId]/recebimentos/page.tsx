import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarRecebimento } from "./actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

const TIPO_LABEL: Record<string, string> = {
  parcela_financiamento: "Parcela de financiamento",
  aporte_cliente: "Aporte do cliente",
};

export default async function RecebimentosPage({
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
  const { data: recebimentos } = await supabase
    .from("recebimentos")
    .select("id, tipo, valor, data, descricao, etapas(nome)")
    .eq("obra_id", obraId)
    .order("data", { ascending: false });

  const { data: etapas } = await supabase.from("etapas").select("id, nome").eq("obra_id", obraId).order("nome");

  const criarRecebimentoNestaObra = criarRecebimento.bind(null, obraId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Recebimentos
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      {recebimentos && recebimentos.length > 0 ? (
        <ul className="flex flex-col gap-stack-sm">
          {recebimentos.map((r) => {
            const etapa = Array.isArray(r.etapas) ? r.etapas[0] : r.etapas;
            return (
              <li
                key={r.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md"
              >
                <div className="flex flex-col">
                  <span className="text-on-surface">{r.descricao || TIPO_LABEL[r.tipo] || r.tipo}</span>
                  <span className="text-on-surface-variant text-[12px]">
                    {[
                      new Date(r.data + "T00:00:00").toLocaleDateString("pt-BR"),
                      TIPO_LABEL[r.tipo] ?? r.tipo,
                      etapa?.nome,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <span className="text-primary font-label-bold text-label-bold whitespace-nowrap">
                  {r.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="font-body-md text-body-md text-on-surface-variant">Nenhum recebimento lançado ainda.</p>
      )}

      <form
        action={criarRecebimentoNestaObra}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <h3 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
          Novo recebimento
        </h3>
        <label className={labelClass} htmlFor="tipo">
          Tipo
        </label>
        <select id="tipo" name="tipo" required className={inputClass}>
          <option value="parcela_financiamento">Parcela de financiamento</option>
          <option value="aporte_cliente">Aporte do cliente</option>
        </select>

        <div className="grid grid-cols-2 gap-stack-sm">
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="valor">
              Valor (R$)
            </label>
            <input id="valor" name="valor" type="number" min="0" step="0.01" required className={inputClass} />
          </div>
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
        </div>

        <label className={labelClass} htmlFor="etapa_id">
          Etapa vinculada
        </label>
        <select id="etapa_id" name="etapa_id" defaultValue="" className={inputClass}>
          <option value="">Nenhuma (opcional)</option>
          {etapas?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nome}
            </option>
          ))}
        </select>

        <label className={labelClass} htmlFor="descricao">
          Descrição
        </label>
        <input id="descricao" name="descricao" type="text" placeholder="Opcional" className={inputClass} />

        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Lançar recebimento
        </button>
      </form>
    </main>
  );
}
