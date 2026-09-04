import { confirmarUploadRecibo } from "@/app/(app)/obras/[obraId]/despesas/capturar/actions";
import { listarUploadsPendentes, removerUploadPendente } from "./fila-offline";

/**
 * Drena a fila de upload pendente (fila-offline.ts): pra cada item, pede
 * uma URL assinada nova (a antiga já expirou — 5min, ver
 * src/lib/storage/signed-url.ts), sobe o blob guardado e, se for recibo,
 * confirma o upload (dispara o pipeline de extração). Reenvio pro mesmo
 * caminho no R2 é idempotente (ADR 0002) — seguro repetir mesmo que uma
 * tentativa anterior tenha parado no meio.
 */
export async function processarFilaOffline(onProgresso?: (restantes: number) => void): Promise<void> {
  const pendentes = await listarUploadsPendentes();
  onProgresso?.(pendentes.length);

  for (const item of pendentes) {
    try {
      const signRes = await fetch("/api/storage/sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: item.tipo, id: item.id, action: "upload", contentType: item.contentType }),
      });
      if (!signRes.ok) continue; // sem conexão ainda ou item órfão — tenta de novo na próxima vez
      const { url } = (await signRes.json()) as { url: string };

      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": item.contentType },
        body: item.blob,
      });
      if (!uploadRes.ok) continue;

      if (item.tipo === "recibo") {
        const resultado = await confirmarUploadRecibo(item.id);
        if ("error" in resultado) continue;
      }

      await removerUploadPendente(item.id);
    } catch {
      // ainda sem sinal — deixa na fila, o próximo evento "online" ou a
      // próxima abertura do app tenta de novo.
    }
  }

  const restantes = await listarUploadsPendentes();
  onProgresso?.(restantes.length);
}
