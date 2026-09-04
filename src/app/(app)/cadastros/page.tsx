import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarCategoria, criarFornecedor } from "./actions";

const TIPO_LABEL: Record<string, string> = {
  produto: "Produto",
  servico: "Serviço",
  mao_de_obra: "Mão de obra",
};

export default async function CadastrosPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const supabase = await createClient();

  // RLS já filtra pro que o usuário tem acesso (has_construtora_access) —
  // sem lógica extra de autorização aqui, mesmo padrão de src/app/obras/page.tsx.
  const { data: construtoras } = await supabase.from("construtoras").select("id, nome");
  const construtoraId = construtoras?.[0]?.id ?? "";

  const { data: categorias } = await supabase
    .from("categorias")
    .select("id, nome, tipo, categoria_pai_id")
    .order("nome");

  // Hierarquia de 2 níveis só (categoria / subcategoria, docs/mvp.md) — sem
  // suporte a sub-de-sub na UI, mesmo que o schema não impeça tecnicamente.
  type Categoria = { id: string; nome: string; tipo: string; categoria_pai_id: string | null };
  const listaCategorias = (categorias ?? []) as Categoria[];
  const categoriasPai = listaCategorias.filter((c) => !c.categoria_pai_id);
  const subcategoriasPorPai = new Map<string, Categoria[]>();
  for (const c of listaCategorias) {
    if (!c.categoria_pai_id) continue;
    const lista = subcategoriasPorPai.get(c.categoria_pai_id) ?? [];
    lista.push(c);
    subcategoriasPorPai.set(c.categoria_pai_id, lista);
  }
  const { data: fornecedores } = await supabase
    .from("fornecedores")
    .select("id, nome, cnpj_cpf, telefone")
    .order("nome");

  return (
    <>
      <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-4xl mx-auto">
        {erro && <ErrorBanner mensagem={erro} />}

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

            {categoriasPai.length > 0 ? (
              <ul className="flex flex-col gap-stack-sm">
                {categoriasPai.map((c) => (
                  <li key={c.id} className="flex flex-col gap-1">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded p-3 flex justify-between items-center font-body-md text-body-md">
                      <span>{c.nome}</span>
                      <span className="text-on-surface-variant text-[12px] uppercase">
                        {TIPO_LABEL[c.tipo] ?? c.tipo}
                      </span>
                    </div>
                    {(subcategoriasPorPai.get(c.id) ?? []).length > 0 && (
                      <ul className="flex flex-col gap-1 pl-stack-md">
                        {subcategoriasPorPai.get(c.id)!.map((sub) => (
                          <li
                            key={sub.id}
                            className="bg-surface border border-outline-variant rounded p-2 flex justify-between items-center font-body-md text-body-md text-[13px]"
                          >
                            <span className="flex items-center gap-1 text-on-surface-variant">
                              <span aria-hidden className="material-symbols-outlined text-[16px]">
                                subdirectory_arrow_right
                              </span>
                              {sub.nome}
                            </span>
                            <span className="text-on-surface-variant text-[12px] uppercase">
                              {TIPO_LABEL[sub.tipo] ?? sub.tipo}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
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
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="cat-pai">
                Categoria pai
                <span className="text-on-surface-variant font-body-md text-[12px] font-normal"> — opcional</span>
              </label>
              <select
                id="cat-pai"
                name="categoria_pai_id"
                defaultValue=""
                className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Nenhuma (categoria principal)</option>
                {categoriasPai.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
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
