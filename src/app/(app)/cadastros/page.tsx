import { createClient } from "@/lib/supabase/server";
import { criarCategoria, criarFornecedor } from "./actions";

const TIPO_LABEL: Record<string, string> = {
  produto: "Produto",
  servico: "Serviço",
  mao_de_obra: "Mão de obra",
};

export default async function CadastrosPage() {
  const supabase = await createClient();

  // RLS já filtra pro que o usuário tem acesso (has_construtora_access) —
  // sem lógica extra de autorização aqui, mesmo padrão de src/app/obras/page.tsx.
  const { data: construtoras } = await supabase.from("construtoras").select("id, nome");
  const construtoraId = construtoras?.[0]?.id ?? "";

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nome, tipo")
    .order("nome");
  const { data: fornecedores } = await supabase
    .from("fornecedores")
    .select("id, nome, cnpj_cpf, telefone")
    .order("nome");

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Cadastros
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Categorias e fornecedores compartilhados entre as obras da construtora.
          </p>
        </div>

        <section className="grid gap-stack-lg md:grid-cols-2">
          <div className="flex flex-col gap-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
              Categorias
            </h3>

            {categorias && categorias.length > 0 ? (
              <ul className="flex flex-col gap-stack-sm">
                {categorias.map((c) => (
                  <li
                    key={c.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md"
                  >
                    <span>{c.nome}</span>
                    <span className="text-on-surface-variant text-[12px] uppercase">
                      {TIPO_LABEL[c.tipo] ?? c.tipo}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant">Nenhuma categoria ainda.</p>
            )}

            <form
              action={criarCategoria}
              className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
            >
              <input type="hidden" name="construtora_id" value={construtoraId} />
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="cat-nome">
                Nome
              </label>
              <input
                id="cat-nome"
                name="nome"
                type="text"
                placeholder="Ex: Cimento e argamassa"
                required
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="cat-tipo">
                Tipo
              </label>
              <select
                id="cat-tipo"
                name="tipo"
                required
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="produto">Produto</option>
                <option value="servico">Serviço</option>
                <option value="mao_de_obra">Mão de obra</option>
              </select>
              <button
                type="submit"
                className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
              >
                Adicionar categoria
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-stack-md">
            <h3 className="font-headline-md text-headline-md text-on-surface border-b-2 border-outline-variant pb-2">
              Fornecedores
            </h3>

            {fornecedores && fornecedores.length > 0 ? (
              <ul className="flex flex-col gap-stack-sm">
                {fornecedores.map((f) => (
                  <li
                    key={f.id}
                    className="bg-surface-container-lowest border border-outline-variant rounded p-3 font-body-md text-body-md"
                  >
                    <p className="text-on-surface">{f.nome}</p>
                    {(f.cnpj_cpf || f.telefone) && (
                      <p className="text-on-surface-variant text-[12px]">
                        {[f.cnpj_cpf, f.telefone].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body-md text-body-md text-on-surface-variant">Nenhum fornecedor ainda.</p>
            )}

            <form
              action={criarFornecedor}
              className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
            >
              <input type="hidden" name="construtora_id" value={construtoraId} />
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="forn-nome">
                Nome
              </label>
              <input
                id="forn-nome"
                name="nome"
                type="text"
                placeholder="Nome da empresa ou prestador"
                required
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="forn-cnpj">
                CNPJ/CPF
              </label>
              <input
                id="forn-cnpj"
                name="cnpj_cpf"
                type="text"
                placeholder="Opcional"
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="forn-tel">
                Telefone
              </label>
              <input
                id="forn-tel"
                name="telefone"
                type="text"
                placeholder="Opcional"
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
              >
                Adicionar fornecedor
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
