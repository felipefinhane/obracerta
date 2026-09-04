import { createClient } from "@/lib/supabase/server";
import { getSignedStorageUrl } from "@/lib/storage/signed-url";
import { ErrorBanner } from "@/components/ErrorBanner";
import { confirmarDespesa } from "./actions";

const inputClass =
  "h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";
const labelClass = "font-label-bold text-label-bold text-on-surface";

type DadosExtraidos = {
  fornecedor?: string;
  data?: string;
  valor_total?: number;
  itens?: { descricao?: string; quantidade?: number; valor_unitario?: number }[];
  confianca?: number;
};

export default async function ConfirmarDespesaPage({
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
    .select("id, recibos(id, status_processamento, dados_extraidos, confianca_extracao)")
    .eq("id", despesaId)
    .single();

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

  // recibos vem embutido como objeto único (unique em recibos.despesa_id),
  // mas trata array por segurança — mesmo motivo do ticket 04.
  const recibo = Array.isArray(despesa?.recibos) ? despesa.recibos[0] : despesa?.recibos;
  const dados = (recibo?.dados_extraidos ?? null) as DadosExtraidos | null;
  const confiancaBaixa = recibo?.confianca_extracao != null && recibo.confianca_extracao < 0.7;

  const fotoUrl = recibo?.id ? (await getSignedStorageUrl(supabase, "recibo", recibo.id, "read"))?.url : null;

  // Itens extraídos pré-preenchem as primeiras linhas; sempre sobra pelo
  // menos 1 linha em branco pra adicionar (mesmo esquema fixo e simples do
  // ticket 02 — sem JS pra lista dinâmica).
  const itensExtraidos = dados?.itens ?? [];
  const linhasItens = Math.max(itensExtraidos.length + 1, 3);

  const confirmarNestaDespesa = confirmarDespesa.bind(null, obraId, despesaId);

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto md:grid md:grid-cols-2 md:items-start">
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary md:col-span-2">
          Confirmar Despesa
        </h2>
        {erro && (
          <div className="md:col-span-2">
            <ErrorBanner mensagem={erro} />
          </div>
        )}
        <div className="flex flex-col gap-stack-sm">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL assinada de curta duração, next/image cacheia por tempo/host fixo
            <img src={fotoUrl} alt="Foto do recibo" className="w-full rounded-lg border border-outline-variant" />
          ) : (
            <div className="w-full aspect-[3/4] rounded-lg border border-outline-variant bg-surface-container-lowest flex items-center justify-center">
              <p className="font-body-md text-body-md text-on-surface-variant">Foto indisponível</p>
            </div>
          )}

          {confiancaBaixa && (
            <div role="alert" className="bg-error-container border-l-4 border-error p-3 flex items-start gap-3 rounded-r">
              <span aria-hidden className="material-symbols-outlined text-error mt-0.5">
                warning
              </span>
              <p className="font-body-md text-body-md text-on-error-container m-0">
                Confiança baixa da extração ({Math.round((recibo?.confianca_extracao ?? 0) * 100)}%) — revisão
                sugerida em todos os campos abaixo.
              </p>
            </div>
          )}

          {recibo?.status_processamento === "falhou" && (
            <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
              A extração automática falhou — preencha os campos manualmente com base na foto.
            </p>
          )}
        </div>

        <form
          action={confirmarNestaDespesa}
          className="flex flex-col gap-stack-md bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
        >
          {dados?.fornecedor && (
            <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
              Extraído da foto: fornecedor <strong>{dados.fornecedor}</strong> — escolha o cadastro
              correspondente abaixo (ou deixe em branco).
            </p>
          )}

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
              <input
                id="data_despesa"
                name="data_despesa"
                type="date"
                defaultValue={dados?.data ?? ""}
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
                defaultValue={dados?.valor_total ?? ""}
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
            <input id="descricao" name="descricao" type="text" placeholder="Opcional" className={inputClass} />
          </div>

          <div className="flex flex-col gap-stack-sm pt-stack-sm">
            <h2 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
              Itens Reconhecidos
            </h2>
            {Array.from({ length: linhasItens }, (_, i) => itensExtraidos[i]).map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto_auto] gap-stack-sm">
                <input
                  name="item_descricao"
                  type="text"
                  placeholder="Descrição do item"
                  defaultValue={item?.descricao ?? ""}
                  aria-label={`Descrição do item ${i + 1}`}
                  className={inputClass}
                />
                <input
                  name="item_quantidade"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Qtd"
                  defaultValue={item?.quantidade ?? ""}
                  aria-label={`Quantidade do item ${i + 1}`}
                  className={`${inputClass} w-20`}
                />
                <input
                  name="item_valor_unitario"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Vlr. unit."
                  defaultValue={item?.valor_unitario ?? ""}
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
            Confirmar Despesa
          </button>
        </form>
      </main>
    </>
  );
}
