// Pipeline de extração de recibo (ticket .scratch/fundacao-tecnica/issues/09)
// Ver docs/planejamento.md §3 e docs/adr/0002-pipeline-captura-de-recibo.md
// (revisado). Disparada por um Database Webhook quando
// recibos.status_processamento vira 'pendente' (não mais no INSERT).
//
// TODO: detecção de QR code / chave de acesso NF-e não implementada ainda —
// sempre cai no fallback de OCR/LLM (Gemini). Não temos uma nota fiscal real
// de teste com QR code (recibo_exemplo.jpg é um recibo informal); implementar
// quando tivermos uma imagem de teste real pra validar contra.

import { GetObjectCommand, S3Client } from "npm:@aws-sdk/client-s3@3.1123.0";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner@3.1123.0";

const GEMINI_MODEL = "gemini-3.6-flash";

const EXTRACAO_SCHEMA = {
  type: "object",
  properties: {
    fornecedor: { type: "string" },
    data: { type: "string", description: "formato YYYY-MM-DD se legível" },
    valor_total: { type: "number" },
    itens: {
      type: "array",
      items: {
        type: "object",
        properties: {
          descricao: { type: "string" },
          quantidade: { type: "number" },
          valor_unitario: { type: "number" },
          valor_total: { type: "number" },
        },
      },
    },
    confianca: { type: "number", description: "0 a 1, sua confiança na extração" },
  },
  required: ["fornecedor", "valor_total", "confianca"],
};

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`env ${name} não configurada`);
  return value;
}

async function marcarFalhou(supabaseUrl: string, serviceKey: string, reciboId: string) {
  await fetch(`${supabaseUrl}/rest/v1/recibos?id=eq.${reciboId}`, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ status_processamento: "falhou" }),
  });
}

Deno.serve(async (req) => {
  const supabaseUrl = env("SUPABASE_URL");
  const serviceKey = env("SUPABASE_SERVICE_ROLE_KEY");

  // Payload de Database Webhook do Supabase: { type, table, record, old_record, schema }
  const payload = await req.json();
  const reciboId: string | undefined = payload.record?.id ?? payload.recibo_id;

  if (!reciboId) {
    return new Response(JSON.stringify({ error: "recibo id ausente no payload" }), { status: 400 });
  }

  try {
    const reciboRes = await fetch(
      `${supabaseUrl}/rest/v1/recibos?id=eq.${reciboId}&select=id,arquivo_url,tipo_documento`,
      { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } },
    );
    const [recibo] = await reciboRes.json();
    if (!recibo) throw new Error("recibo não encontrado");

    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${env("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env("R2_ACCESS_KEY_ID"),
        secretAccessKey: env("R2_SECRET_ACCESS_KEY"),
      },
    });
    // Baixa via URL assinada + fetch puro em vez de obj.Body.transformToByteArray()
    // — esse helper do SDK bate num bug de compat no runtime Deno das Edge
    // Functions (ERR_OUT_OF_RANGE tentando um path de Buffer do Node).
    const getUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: env("R2_BUCKET_NAME"), Key: recibo.arquivo_url }),
      { expiresIn: 60 },
    );
    const fileRes = await fetch(getUrl);
    if (!fileRes.ok) throw new Error(`download do R2 falhou: ${fileRes.status}`);
    const bytes = new Uint8Array(await fileRes.arrayBuffer());
    const imageBase64 = toBase64(bytes);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${env("GEMINI_API_KEY")}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: "Extraia os dados desse recibo/nota fiscal. Se não conseguir ler algum campo, omita ou deixe null." },
                { inline_data: { mime_type: "image/jpeg", data: imageBase64 } },
              ],
            },
          ],
          generationConfig: { responseMimeType: "application/json", responseSchema: EXTRACAO_SCHEMA },
        }),
      },
    );

    if (!geminiRes.ok) {
      throw new Error(`Gemini respondeu ${geminiRes.status}: ${await geminiRes.text()}`);
    }

    const geminiJson = await geminiRes.json();
    const text = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Gemini não retornou conteúdo");

    const dadosExtraidos = JSON.parse(text);

    const patchRes = await fetch(`${supabaseUrl}/rest/v1/recibos?id=eq.${reciboId}`, {
      method: "PATCH",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        dados_extraidos: dadosExtraidos,
        confianca_extracao: dadosExtraidos.confianca ?? null,
        tipo_documento: recibo.tipo_documento ?? "recibo_informal",
        status_processamento: "processado",
      }),
    });

    if (!patchRes.ok) throw new Error(`update do recibo falhou: ${patchRes.status}`);

    return new Response(JSON.stringify({ ok: true, recibo_id: reciboId }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("extrair-recibo falhou:", err);
    await marcarFalhou(supabaseUrl, serviceKey, reciboId);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
