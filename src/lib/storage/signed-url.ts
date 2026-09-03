import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as presign } from "@aws-sdk/s3-request-presigner";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createR2Client, R2_BUCKET } from "./r2";

export type StorageKind = "recibo" | "diario_midia";

export const TABLE_BY_KIND: Record<StorageKind, string> = {
  recibo: "recibos",
  diario_midia: "diario_midia",
};

/**
 * Mesma lógica de autorização de `src/app/api/storage/sign/route.ts` (ADR
 * 0003) — extraída pra dar pra chamar direto de um Server Component (ex.
 * tela de confirmação, pra pedir a URL de leitura da foto) sem precisar de
 * um round-trip HTTP interno pro próprio Route Handler. NÃO confia num
 * `obra_id` vindo de fora: busca a linha com o client Supabase da sessão do
 * usuário — a policy de select já é o `has_obra_access`/`has_obra_write_access`.
 */
export async function getSignedStorageUrl(
  supabase: SupabaseClient,
  kind: StorageKind,
  id: string,
  action: "upload" | "read",
  contentType?: string,
): Promise<{ url: string; key: string } | null> {
  const { data, error } = await supabase.from(TABLE_BY_KIND[kind]).select("arquivo_url").eq("id", id).single();

  if (error || !data?.arquivo_url) {
    return null;
  }

  const key = data.arquivo_url as string;
  const s3 = createR2Client();

  const command =
    action === "upload"
      ? new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType ?? "image/jpeg" })
      : new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });

  const url = await presign(s3, command, { expiresIn: 300 });

  return { url, key };
}
