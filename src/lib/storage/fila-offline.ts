/**
 * Fila local de upload pendente (IndexedDB) — resiliência básica de conexão
 * pedida em docs/mvp.md §1: "se o upload falhar por falta de sinal, o app
 * guarda localmente e tenta reenviar quando a conexão voltar". NÃO é o
 * PWA offline-first completo (fila + background sync via service worker,
 * docs/mvp.md §2, fase 2) — aqui é só não perder a foto se o `PUT` pro R2
 * falhar depois que o lançamento (despesa/recibo ou diário) já foi criado
 * no banco. Só roda no browser.
 */

const DB_NAME = "obracerta-fila-offline";
const DB_VERSION = 1;
const STORE = "uploads_pendentes";

export type UploadPendente = {
  id: string; // recibo.id ou diario_midia.id — mesmo id usado como chave no R2
  tipo: "recibo" | "diario_midia";
  blob: Blob;
  contentType: string;
  criadoEm: number;
};

function abrirDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) {
        req.result.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function salvarUploadPendente(item: UploadPendente): Promise<void> {
  const db = await abrirDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function listarUploadsPendentes(): Promise<UploadPendente[]> {
  const db = await abrirDb();
  const itens = await new Promise<UploadPendente[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as UploadPendente[]);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return itens;
}

export async function removerUploadPendente(id: string): Promise<void> {
  const db = await abrirDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
