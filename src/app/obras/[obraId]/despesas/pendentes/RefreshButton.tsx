"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

/**
 * Sem Supabase Realtime (descartado, planejamento.md §7) — atualização é
 * refetch simples sob demanda.
 */
export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      onClick={() => startTransition(() => router.refresh())}
      disabled={isPending}
      className="font-label-bold text-label-bold text-primary hover:underline flex items-center gap-1"
    >
      <span aria-hidden className="material-symbols-outlined text-[18px]">
        refresh
      </span>
      {isPending ? "Atualizando…" : "Atualizar"}
    </button>
  );
}
