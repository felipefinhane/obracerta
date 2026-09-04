"use client";

/**
 * Generaliza o padrão já usado em `ExcluirEtapaForm` (excluir etapa) — form
 * de um Server Action sem argumentos restantes, com `confirm()` antes de
 * submeter. Client Component só por causa do `confirm()`.
 */
export function ConfirmDeleteForm({
  action,
  confirmMessage,
  label = "Excluir",
}: {
  action: () => void;
  confirmMessage: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        aria-label={label}
        className="text-error p-2 hover:bg-error-container rounded transition-colors"
      >
        <span aria-hidden className="material-symbols-outlined text-[18px]">
          delete
        </span>
      </button>
    </form>
  );
}
