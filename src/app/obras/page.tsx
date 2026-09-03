import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { criarObra } from "./actions";

export default async function ObrasPage() {
  const supabase = await createClient();

  // RLS já filtra pro que o usuário tem acesso (has_obra_access) — sem
  // lógica extra de autorização aqui.
  const { data: obras } = await supabase
    .from("obras")
    .select("id, nome, endereco, cliente_nome, valor_planejado_total")
    .order("criado_em", { ascending: false });

  const { data: construtoras } = await supabase.from("construtoras").select("id, nome");

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="bg-surface border-b border-outline-variant flex items-center justify-between px-margin-mobile h-touch-target-min">
        <h1 className="font-headline-md text-headline-md text-primary">ObraCerta</h1>
        <Link href="/cadastros" className="font-label-bold text-label-bold text-primary hover:underline">
          Cadastros
        </Link>
      </header>

      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-stack-md">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
              Obras
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Gerencie e acompanhe o progresso das suas obras.
            </p>
          </div>
        </div>

        {obras && obras.length > 0 ? (
          <div className="grid gap-stack-lg md:grid-cols-2 lg:grid-cols-3">
            {obras.map((obra) => (
              <article
                key={obra.id}
                className="bg-surface-container-lowest border border-outline-variant rounded p-stack-md flex flex-col gap-stack-md shadow-sm"
              >
                <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-1">{obra.nome}</h3>
                  {obra.cliente_nome && (
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1">
                      <span aria-hidden className="material-symbols-outlined text-[18px]">
                        person
                      </span>
                      {obra.cliente_nome}
                    </p>
                  )}
                  {obra.endereco && (
                    <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1 mt-1">
                      <span aria-hidden className="material-symbols-outlined text-[18px]">
                        location_on
                      </span>
                      {obra.endereco}
                    </p>
                  )}
                </div>
                <div className="flex gap-stack-sm pt-stack-sm border-t border-outline-variant">
                  <Link
                    href={`/obras/${obra.id}/despesas`}
                    className="font-label-bold text-label-bold text-primary hover:underline"
                  >
                    Despesas
                  </Link>
                  <Link
                    href={`/obras/${obra.id}/etapas`}
                    className="font-label-bold text-label-bold text-primary hover:underline"
                  >
                    Etapas
                  </Link>
                  <Link
                    href={`/obras/${obra.id}/orcado-realizado`}
                    className="font-label-bold text-label-bold text-primary hover:underline"
                  >
                    Orçado x Realizado
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma obra ainda.</p>
        )}

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
    </div>
  );
}
