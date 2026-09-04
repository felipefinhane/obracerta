"use client";

export function ExcluirEtapaForm({ action, etapaNome }: { action: () => void; etapaNome: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(`Excluir a etapa "${etapaNome}"? Essa ação não pode ser desfeita.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label={`Excluir etapa ${etapaNome}`}
        className="text-error font-button-text text-button-text flex items-center gap-1 p-2 hover:bg-error-container rounded transition-colors"
      >
        <span aria-hidden className="material-symbols-outlined text-[18px]">
          delete
        </span>
      </button>
    </form>
  );
}
