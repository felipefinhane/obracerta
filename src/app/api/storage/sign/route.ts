import { NextRequest, NextResponse } from "next/server";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createClient } from "@/lib/supabase/server";
import { createR2Client, R2_BUCKET } from "@/lib/storage/r2";

type Kind = "recibo" | "diario_midia";

const TABLE_BY_KIND: Record<Kind, string> = {
  recibo: "recibos",
  diario_midia: "diario_midia",
};

/**
 * Emite URL assinada de upload/leitura pro Cloudflare R2 (ADR 0003).
 *
 * Autorização: NÃO confia num obra_id vindo do cliente (evitaria um
 * "confused deputy" — alegar acesso a uma obra própria pra pedir a URL de
 * um recibo alheio). Em vez disso, busca a linha (recibos/diario_midia) com
 * o client Supabase da sessão do usuário — a policy de `select` dessas
 * tabelas já é o has_obra_access. Se a linha voltar, o acesso está provado;
 * o caminho no R2 vem do próprio `arquivo_url` da linha.
 */
export async function POST(req: NextRequest) {
  let body: { kind?: Kind; id?: string; action?: "upload" | "read"; contentType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const { kind, id, action, contentType } = body;

  if (!kind || !TABLE_BY_KIND[kind] || !id || (action !== "upload" && action !== "read")) {
    return NextResponse.json({ error: "parâmetros inválidos" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE_BY_KIND[kind])
    .select("arquivo_url")
    .eq("id", id)
    .single();

  if (error || !data?.arquivo_url) {
    return NextResponse.json({ error: "não encontrado ou sem acesso" }, { status: 404 });
  }

  const key = data.arquivo_url as string;
  const s3 = createR2Client();

  const command =
    action === "upload"
      ? new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, ContentType: contentType ?? "image/jpeg" })
      : new GetObjectCommand({ Bucket: R2_BUCKET, Key: key });

  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return NextResponse.json({ url, key });
}
