import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarRecebimento } from "../actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function NovoRecebimentoPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();

  const { data: etapas } = await supabase.from("etapas").select("id, nome").eq("obra_id", obraId).order("nome");
  const criarRecebimentoNestaObra = criarRecebimento.bind(null, obraId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Novo Recebimento
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={criarRecebimentoNestaObra}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
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
