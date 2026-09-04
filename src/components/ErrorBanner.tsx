/**
 * Markup repetido em onboarding/equipe até este ticket existir — extraído
 * pra não duplicar de novo em mais telas (.scratch/polish-erros/01).
 */
export function ErrorBanner({ mensagem }: { mensagem: string }) {
  return (
    <div role="alert" className="bg-error-container border-l-4 border-error p-3 flex items-start gap-3 rounded-r">
      <span aria-hidden className="material-symbols-outlined text-error mt-0.5">
        error
      </span>
      <p className="font-body-md text-body-md text-on-error-container m-0">{mensagem}</p>
    </div>
  );
}
