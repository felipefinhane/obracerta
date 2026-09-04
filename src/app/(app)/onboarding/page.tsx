import { criarConstrutora } from "./actions";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <main className="flex-grow flex flex-col justify-center items-center px-margin-mobile md:px-8 py-stack-lg">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant p-stack-lg rounded-xl flex flex-col gap-stack-lg shadow-sm">
          <div className="text-center mb-stack-sm">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-stack-sm">
              <span aria-hidden className="material-symbols-outlined text-on-primary-container text-3xl">
                domain
              </span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-stack-sm">
              Bem-vindo ao ObraCerta
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Crie o perfil da sua construtora para começar a gerenciar suas obras.
            </p>
          </div>

          {erro && (
            <div role="alert" className="bg-error-container border-l-4 border-error p-3 flex items-start gap-3 rounded-r">
              <span aria-hidden className="material-symbols-outlined text-error mt-0.5">
                error
              </span>
              <p className="font-body-md text-body-md text-on-error-container m-0">{erro}</p>
            </div>
          )}

          <form action={criarConstrutora} className="flex flex-col gap-stack-md w-full">
            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface" htmlFor="nome">
                Nome da Construtora
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Ex: Construtora Silva"
                required
                className="w-full h-touch-target-min px-4 bg-surface border border-outline rounded text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
              />
            </div>

            <div className="flex flex-col gap-stack-sm">
              <label className="font-label-bold text-label-bold text-on-surface flex items-center justify-between" htmlFor="cnpj">
                CNPJ
                <span className="text-on-surface-variant font-body-md text-[12px] font-normal">Opcional</span>
              </label>
              <input
                id="cnpj"
                name="cnpj"
                type="text"
                placeholder="00.000.000/0000-00"
                className="w-full h-touch-target-min px-4 bg-surface border border-outline rounded text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-outline"
              />
            </div>

            <button
              type="submit"
              className="w-full h-touch-target-min bg-secondary-container text-on-secondary hover:opacity-90 transition-all rounded font-button-text text-button-text flex items-center justify-center gap-base mt-stack-sm shadow-sm"
            >
              Continuar
              <span aria-hidden className="material-symbols-outlined text-lg">
                arrow_forward
              </span>
            </button>
          </form>
      </div>
    </main>
  );
}
