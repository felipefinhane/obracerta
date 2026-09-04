"use client";

import { useEffect, useState } from "react";
import { listarUploadsPendentes } from "@/lib/storage/fila-offline";
import { processarFilaOffline } from "@/lib/storage/processar-fila-offline";

/**
 * Monta uma vez no layout logado inteiro (não só na tela de captura) —
 * assim uma foto guardada offline é reenviada mesmo que o usuário já tenha
 * saído da tela de captura antes da conexão voltar. Resiliência básica de
 * conexão (docs/mvp.md §1), não o PWA offline-first completo (fase 2).
 */
export function SincronizacaoOffline() {
  const [pendentes, setPendentes] = useState(0);
  const [sincronizando, setSincronizando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    async function sincronizar() {
      if (!navigator.onLine) return;
      setSincronizando(true);
      await processarFilaOffline((restantes) => {
        if (!cancelado) setPendentes(restantes);
      });
      if (!cancelado) setSincronizando(false);
    }

    listarUploadsPendentes()
      .then((itens) => {
        if (!cancelado) setPendentes(itens.length);
      })
      .then(sincronizar)
      .catch(() => {
        // IndexedDB indisponível (raro) — sem indicador, sem quebrar o app.
      });

    window.addEventListener("online", sincronizar);
    return () => {
      cancelado = true;
      window.removeEventListener("online", sincronizar);
    };
  }, []);

  if (pendentes === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-30 bg-surface border border-outline-variant rounded-lg shadow-lg px-4 py-2 flex items-center gap-2 font-body-md text-body-md text-on-surface">
      <span
        aria-hidden
        className={`material-symbols-outlined text-[18px] text-primary ${sincronizando ? "animate-spin" : ""}`}
      >
        {sincronizando ? "sync" : "cloud_off"}
      </span>
      {pendentes} {pendentes === 1 ? "foto pendente de envio" : "fotos pendentes de envio"}
    </div>
  );
}
