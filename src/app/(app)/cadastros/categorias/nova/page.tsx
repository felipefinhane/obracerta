import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarCategoria } from "../../actions";

export default async function NovaCategoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const supabase = await createClient();

  const { data: construtoras } = await supabase.from("construtoras").select("id, nome");
  const construtoraId = construtoras?.[0]?.id ?? "";

  // Só categorias de nível principal como opção de pai (hierarquia de 2
  // níveis, mesmo corte de docs/mvp.md — sem sub-de-sub na UI).
  const { data: categoriasPai } = await supabase
    .from("categorias")
    .select("id, nome")
    .is("categoria_pai_id", null)
    .order("nome");

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Nova Categoria
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

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
          {categoriasPai?.map((c) => (
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
    </main>
  );
}
