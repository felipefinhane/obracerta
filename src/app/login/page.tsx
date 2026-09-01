import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-margin-mobile bg-surface">
      <header className="w-full max-w-md mb-stack-lg flex justify-center">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary">
          ObraCerta
        </h1>
      </header>

      <main className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-lg p-margin-mobile">
        <form action={login} className="flex flex-col gap-stack-md">
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="min-h-[48px] px-3 border border-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-surface-container-lowest text-on-surface font-body-md text-body-md rounded"
            />
          </div>

          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-bold text-label-bold text-on-surface" htmlFor="password">
              Senha
            </label>
            <PasswordInput id="password" name="password" autoComplete="current-password" invalid={!!erro} />
          </div>

          {erro && (
            <div
              role="alert"
              className="bg-error-container border-l-4 border-error p-3 flex items-start gap-3 rounded-r"
            >
              <span aria-hidden className="material-symbols-outlined text-error mt-0.5">
                error
              </span>
              <p className="font-body-md text-body-md text-on-error-container m-0">{erro}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full min-h-[48px] bg-secondary-container text-on-secondary font-button-text text-button-text rounded mt-stack-sm flex items-center justify-center transition-colors hover:bg-secondary"
          >
            Entrar
          </button>
        </form>

        <div className="mt-stack-lg text-center border-t border-outline-variant pt-stack-md">
          <span className="font-body-md text-body-md text-on-surface-variant">Ainda não tem conta?</span>{" "}
          <Link href="/cadastro" className="font-button-text text-button-text text-primary hover:underline">
            Criar conta
          </Link>
        </div>
      </main>
    </div>
  );
}
