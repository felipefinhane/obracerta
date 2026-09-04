import { createClient } from "@/lib/supabase/server";
import { ErrorBanner } from "@/components/ErrorBanner";
import { criarFornecedor } from "../../actions";

export default async function NovoFornecedorPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const supabase = await createClient();
  const { data: construtoras } = await supabase.from("construtoras").select("id, nome");
  const construtoraId = construtoras?.[0]?.id ?? "";

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Novo Fornecedor
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

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
    </main>
  );
}
