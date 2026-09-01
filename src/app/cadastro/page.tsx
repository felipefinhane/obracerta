import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { cadastrar } from "./actions";

export default async function CadastroPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-margin-mobile bg-surface">
      <main className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-secondary-container" />

        <div className="text-center mb-stack-lg">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-stack-sm">
            ObraCerta
          </h1>
          <h2 className="font-headline-md text-headline-md text-on-surface">Cadastro</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-stack-sm">
            Crie sua conta para gerenciar suas obras. O login é imediato logo após o cadastro.
          </p>
        </div>

        {erro && (
          <div role="alert" className="bg-error-container border-l-4 border-error p-3 flex items-start gap-3 rounded-r mb-stack-md">
            <span aria-hidden className="material-symbols-outlined text-error mt-0.5">
              error
            </span>
            <p className="font-body-md text-body-md text-on-error-container m-0">{erro}</p>
          </div>
        )}

        <form action={cadastrar} className="flex flex-col gap-stack-md">
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
              Email
            </label>
            <div className="relative flex items-center">
              <span aria-hidden className="material-symbols-outlined absolute left-3 text-on-surface-variant">
                mail
              </span>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                required
                autoComplete="email"
                className="w-full h-touch-target-min pl-10 pr-3 bg-surface-container-lowest border border-outline rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="password">
              Senha
            </label>
            <PasswordInput id="password" name="password" autoComplete="new-password" minLength={6} />
          </div>

          <button
            type="submit"
            className="w-full h-touch-target-min mt-stack-lg bg-secondary-container hover:bg-secondary text-on-secondary rounded-lg font-button-text text-button-text flex items-center justify-center gap-base transition-colors"
          >
            <span>Cadastrar e Começar</span>
            <span aria-hidden className="material-symbols-outlined">
              arrow_forward
            </span>
          </button>
        </form>

        <div className="mt-stack-lg text-center font-body-md text-body-md text-on-surface-variant">
          Já tem uma conta?{" "}
          <Link href="/login" className="font-label-bold text-label-bold text-primary hover:underline">
            Fazer Login
          </Link>
        </div>
      </main>
    </div>
  );
}
