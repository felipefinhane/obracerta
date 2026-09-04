import { ErrorBanner } from "@/components/ErrorBanner";
import { convidarMembro } from "../actions";

export default async function AdicionarMembroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="px-margin-mobile pt-stack-lg pb-stack-lg flex flex-col gap-stack-lg max-w-md mx-auto">
      <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
        Adicionar à Equipe
      </h2>
      {erro && <ErrorBanner mensagem={erro} />}

      <form
        action={convidarMembro}
        className="flex flex-col gap-stack-sm bg-surface-container-lowest p-stack-md border border-outline-variant rounded-lg"
      >
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="pessoa@exemplo.com"
          required
          className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <label className="font-label-bold text-label-bold text-on-surface" htmlFor="papel">
          Papel
        </label>
        <select
          id="papel"
          name="papel"
          required
          className="h-touch-target-min px-3 border border-outline rounded bg-surface-bright text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="engenheiro">Engenheiro/Mestre de obra</option>
          <option value="financeiro">Financeiro</option>
          <option value="admin">Admin</option>
        </select>
        <p className="font-body-md text-body-md text-on-surface-variant text-[12px]">
          Acesso automático a todas as obras da construtora. Se a pessoa ainda não tem conta, o acesso é liberado
          assim que ela se cadastrar com esse e-mail.
        </p>
        <button
          type="submit"
          className="h-touch-target-min px-6 bg-secondary-container text-on-secondary font-button-text text-button-text rounded hover:opacity-90 transition-opacity mt-stack-sm"
        >
          Adicionar
        </button>
      </form>
    </main>
  );
}
