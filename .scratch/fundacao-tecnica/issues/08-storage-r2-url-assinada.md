# Storage — bucket R2 + Route Handler de URL assinada

Status: open
Blocked by: 02

## Contexto

Ver `docs/adr/0003-storage-cloudflare-r2-url-assinada.md` pro desenho completo e o porquê (R2 no lugar do Supabase Storage pelo tier gratuito maior).

## Escopo

- Bucket privado no Cloudflare R2 (tier gratuito, 10GB/mês + egress ilimitado).
- Route Handler no Next.js que emite URL assinada de **upload**: recebe o caminho determinístico (`recibos/{id}.jpg` ou equivalente do diário), chama `has_obra_access`/`has_construtora_access` via RPC pra checar autorização, só então gera a URL.
- Route Handler equivalente pra URL assinada de **leitura** — mesma checagem de autorização antes de gerar.
- Compressão da foto no cliente antes do upload (ex.: máx. ~1600px, JPEG ~70%) — ver ADR 0003.
- Credenciais R2 (S3-compatível) configuradas como secret, tanto pro Route Handler quanto pra Edge Function de extração (ticket 09) conseguir ler o arquivo depois.

## Fora de escopo

A Edge Function de extração em si (ticket 09) — aqui só o storage e a emissão de URL.

## Comments
