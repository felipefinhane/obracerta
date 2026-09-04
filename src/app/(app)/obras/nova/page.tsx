import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarObra } from "../actions";

export default async function NovaObraPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const supabase = await createClient();
  const { data: construtoras } = await supabase.from("construtoras").select("id, nome");

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-2xl mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Nova Obra
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={criarObra}
        className="space-y-stack-lg bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        {construtoras && construtoras.length > 1 ? (
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="construtora_id">
              Construtora
            </label>
            <select
              id="construtora_id"
              name="construtora_id"
              required
              className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {construtoras.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <input type="hidden" name="construtora_id" value={construtoras?.[0]?.id ?? ""} />
        )}

        <div className="space-y-stack-md">
          <h2 className="font-headline-md text-headline-md font-bold text-primary border-b-2 border-outline-variant pb-2">
            Informações da Obra
          </h2>
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="nome">
              Nome da Obra *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              placeholder="Ex: Residencial Flores"
              required
              className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md"
            />
          </div>
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="endereco">
              Endereço
            </label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              placeholder="Rua, Número, Bairro, Cidade"
              className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md"
            />
          </div>
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="cliente_nome">
              Nome do Cliente
            </label>
            <input
              id="cliente_nome"
              name="cliente_nome"
              type="text"
              placeholder="Nome completo ou Empresa"
              className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md"
            />
          </div>
        </div>

        <div className="space-y-stack-md pt-stack-sm">
          <h2 className="font-headline-md text-headline-md font-bold text-primary border-b-2 border-outline-variant pb-2">
            Planejamento Financeiro e Prazos
          </h2>
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="valor_planejado_total">
              Valor Total Planejado (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md text-body-md">
                R$
              </span>
              <input
                id="valor_planejado_total"
                name="valor_planejado_total"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                className="w-full h-touch-target-min pl-10 pr-3 border border-outline rounded bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="data_inicio_prevista">
                Data de Início
              </label>
              <input
                id="data_inicio_prevista"
                name="data_inicio_prevista"
                type="date"
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md"
              />
            </div>
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="data_fim_prevista">
                Data de Fim Prevista
              </label>
              <input
                id="data_fim_prevista"
                name="data_fim_prevista"
                type="date"
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-body-md text-body-md"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full md:w-auto h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span aria-hidden className="material-symbols-outlined">
            save
          </span>
          Salvar Obra
        </button>
      </form>
    </main>
  );
}
