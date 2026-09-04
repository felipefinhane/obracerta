import { ErrorBanner } from "@/components/ErrorBanner";
import { importarExtrato } from "../actions";

export default async function ImportarExtratoPage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId } = await params;
  const { erro } = await searchParams;
  const importarExtratoNestaObra = importarExtrato.bind(null, obraId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          Importar Extrato
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Arquivo CSV com colunas: data, descrição, valor — positivo pra entrada, negativo pra saída.
        </p>
      </div>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={importarExtratoNestaObra}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <input type="file" name="arquivo" accept=".csv,text/csv" required className="font-body-md text-body-md" />
        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Importar
        </button>
      </form>
    </main>
  );
}
