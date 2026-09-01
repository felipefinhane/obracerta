/**
 * Comprime uma imagem no cliente antes do upload (ADR 0003) — resolução alta
 * não ajuda o OCR/LLM de extração, e uma foto de recibo não comprimida pode
 * facilmente ter 3-5MB, o que esgota o tier gratuito do R2 rápido.
 *
 * Só roda no browser (usa Canvas/Image do DOM) — não importar em código de
 * server. Sem wiring ainda com nenhuma tela de captura (não existe ainda);
 * fica pronta pra quando o módulo de despesas tiver a tela de foto.
 */
export async function compressImage(
  file: File,
  { maxDimension = 1600, quality = 0.7 }: { maxDimension?: number; quality?: number } = {},
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D não disponível");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );
  if (!blob) throw new Error("Falha ao gerar blob comprimido");

  return blob;
}
