import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarDespesaManual } from "./actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

export default async function NovaDespesaManualPage({
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
  const { data: obra } = await supabase.from("obras").select("nome, construtora_id").eq("id", obraId).single();

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

  const criarDespesaNestaObra = criarDespesaManual.bind(null, obraId);

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
        {erro && <ErrorBanner mensagem={erro} />}

        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Nova Despesa
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">{obra?.nome ?? "Obra"}</p>
        </div>

        <form
          action={criarDespesaNestaObra}
          className="flex flex-col gap-stack-md bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
        >
          <div className="flex flex-col gap-stack-sm">
            <label className={labelClass} htmlFor="fornecedor_id">
              Fornecedor
            </label>
            <select id="fornecedor_id" name="fornecedor_id" defaultValue="" className={inputClass}>
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
              <input id="data_despesa" name="data_despesa" type="date" required className={inputClass} />
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
                placeholder="0,00"
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
              <select id="forma_pagamento" name="forma_pagamento" defaultValue="" className={inputClass}>
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
              <select id="categoria_id" name="categoria_id" defaultValue="" className={inputClass}>
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
            <select id="etapa_id" name="etapa_id" defaultValue="" className={inputClass}>
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
            <input id="descricao" name="descricao" type="text" placeholder="Ex: Cimento 50kg" className={inputClass} />
          </div>

          <div className="flex flex-col gap-stack-sm pt-stack-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
              Itens da Despesa
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
              Opcional — deixe em branco o que não usar.
            </p>
            {[0, 1, 2].map((i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-stack-sm">
                <input
                  name="item_descricao"
                  type="text"
                  placeholder="Descrição do item"
                  aria-label={`Descrição do item ${i + 1}`}
                  className={inputClass}
                />
                <input
                  name="item_quantidade"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Qtd"
                  aria-label={`Quantidade do item ${i + 1}`}
                  className={`${inputClass} w-20`}
                />
                <input
                  name="item_valor_unitario"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Vlr. unit."
                  aria-label={`Valor unitário do item ${i + 1}`}
                  className={`${inputClass} w-28`}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
          >
            Salvar Despesa
          </button>
        </form>
      </main>
    </>
  );
}
