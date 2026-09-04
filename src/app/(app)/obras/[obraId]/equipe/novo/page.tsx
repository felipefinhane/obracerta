import { ErrorBanner } from "@/components/ErrorBanner";
import { convidarClienteObra } from "../actions";

export default async function ConvidarClientePage({
  params,
  searchParams,
}: {
  params: Promise<{ obraId: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { obraId } = await params;
  const { erro } = await searchParams;
  const convidarNestaObra = convidarClienteObra.bind(null, obraId);

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Convidar Cliente
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={convidarNestaObra}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="cliente@exemplo.com"
          required
          className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Convidar
        </button>
      </form>
    </main>
  );
}
