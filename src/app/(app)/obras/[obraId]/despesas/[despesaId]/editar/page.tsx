import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { atualizarDespesa } from "./actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function EditarDespesaPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string; despesaId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId, despesaId } = await params;
  const { erro } = await searchParams;
  const supabase = await createClient();

  // RLS já filtra (has_obra_access) — sem lógica extra de autorização aqui.
  const { data: despesa } = await supabase
    .from("despesas")
    .select("fornecedor_id, categoria_id, etapa_id, data_despesa, valor, forma_pagamento, descricao")
    .eq("id", despesaId)
    .single();

  const { data: obra } = await supabase.from("obras").select("construtora_id").eq("id", obraId).single();

  const [{ data: fornecedores }, { data: categorias }, { data: etapas }] = await Promise.all([
    supabase
      .from("fornecedores")
      .select("id, nome")
      .eq("construtora_id", obra?.construtora_id ?? "")
      .order("nome"),
    supabase
      .from("categorias")
      .select("id, nome")
      .eq("construtora_id", obra?.construtora_id ?? "")
      .order("nome"),
    supabase.from("etapas").select("id, nome").eq("obra_id", obraId).order("nome"),
  ]);

  const atualizarEstaDespesa = atualizarDespesa.bind(null, obraId, despesaId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Editar Despesa
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={atualizarEstaDespesa}
        className="flex flex-col gap-stack-md bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <div className="flex flex-col gap-stack-sm">
          <label className={labelClass} htmlFor="fornecedor_id">
            Fornecedor
          </label>
          <select
            id="fornecedor_id"
            name="fornecedor_id"
            defaultValue={despesa?.fornecedor_id ?? ""}
            className={inputClass}
          >
            <option value="">Selecione (opcional)</option>
            {fornecedores?.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-stack-md">
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="data_despesa">
              Data
            </label>
            <input
              id="data_despesa"
              name="data_despesa"
              type="date"
              defaultValue={despesa?.data_despesa ?? ""}
              required
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="valor">
              Valor Total (R$)
            </label>
            <input
              id="valor"
              name="valor"
              type="number"
              min="0"
              step="0.01"
              defaultValue={despesa?.valor ?? ""}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-stack-md">
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="forma_pagamento">
              Forma de Pagamento
            </label>
            <select
              id="forma_pagamento"
              name="forma_pagamento"
              defaultValue={despesa?.forma_pagamento ?? ""}
              className={inputClass}
            >
              <option value="" disabled>
                Selecione
              </option>
              <option value="pix">PIX</option>
              <option value="boleto">Boleto</option>
              <option value="cartao">Cartão de Crédito</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="transferencia">Transferência Bancária</option>
            </select>
          </div>
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="categoria_id">
              Categoria
            </label>
            <select
              id="categoria_id"
              name="categoria_id"
              defaultValue={despesa?.categoria_id ?? ""}
              className={inputClass}
            >
              <option value="">Selecione (opcional)</option>
              {categorias?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-stack-sm">
          <label className={labelClass} htmlFor="etapa_id">
            Etapa Vinculada
          </label>
          <select id="etapa_id" name="etapa_id" defaultValue={despesa?.etapa_id ?? ""} className={inputClass}>
            <option value="">Vincular a uma etapa (opcional)</option>
            {etapas?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-stack-sm">
          <label className={labelClass} htmlFor="descricao">
            Descrição
          </label>
          <input
            id="descricao"
            name="descricao"
            type="text"
            defaultValue={despesa?.descricao ?? ""}
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Salvar alterações
        </button>
      </form>
    </main>
  );
}
