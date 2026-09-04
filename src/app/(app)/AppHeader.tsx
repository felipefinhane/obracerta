import Link from "next/link";
import { signOut } from "./actions";

/**
 * Header compartilhado de toda a área logada (layout.tsx deste route
 * group). Antes disso cada página desenhava o próprio cabeçalho solto, sem
 * navegação consistente nem jeito de sair da conta — gap relatado pelo
 * usuário em 2026-09-04. A faixa de sub-navegação por obra (Despesas,
 * Etapas, etc.) fica em `obras/[obraId]/ObraSubNav.tsx` — este componente
 * não tem acesso a `obraId` (fica acima desse segmento na árvore de rotas).
 */
export function AppHeader({ userEmail }: { userEmail: string | null }) {
  return (
    <header className="bg-surface border-b border-outline-variant sticky top-0 z-10">
      <div className="flex items-center justify-between px-margin-mobile h-touch-target-min gap-stack-md">
        <Link href="/obras" className="font-headline-md text-headline-md text-primary flex-shrink-0">
          ObraCerta
        </Link>

        <div className="flex items-center gap-stack-sm flex-shrink-0">
          <Link
            href="/cadastros"
            className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary hidden sm:inline"
          >
            Cadastros
          </Link>
          <Link
            href="/equipe"
            className="font-label-bold text-label-bold text-on-surface-variant hover:text-primary hidden sm:inline"
          >
            Equipe
          </Link>
          {userEmail && (
            <span className="font-body-md text-body-md text-on-surface-variant text-[12px] hidden md:inline truncate max-w-[180px]">
              {userEmail}
            </span>
          )}
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sair"
              className="font-label-bold text-label-bold text-on-surface-variant hover:text-error flex items-center gap-1 p-2 rounded hover:bg-error-container transition-colors"
            >
              <span aria-hidden className="material-symbols-outlined text-[18px]">
                logout
              </span>
              <span className="hidden sm:inline">Sair</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
