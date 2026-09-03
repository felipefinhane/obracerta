import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSignedStorageUrl, TABLE_BY_KIND, type StorageKind } from "@/lib/storage/signed-url";

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
  let body: { kind?: StorageKind; id?: string; action?: "upload" | "read"; contentType?: string };
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
  const signed = await getSignedStorageUrl(supabase, kind, id, action, contentType);

  if (!signed) {
    return NextResponse.json({ error: "não encontrado ou sem acesso" }, { status: 404 });
  }

  return NextResponse.json(signed);
}
