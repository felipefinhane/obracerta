# Storage — bucket R2 + Route Handler de URL assinada

Status: done
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

- Bucket R2 (`obracerta`) e credenciais criados pelo usuário no Cloudflare. Testado com script real: list, PUT assinado, GET assinado, delete — tudo OK.
- Gap fechado antes de dar pra testar isso: nenhuma tabela tinha policy de `insert`/`update` (só leitura, tickets 03-07). Nova função `has_obra_write_access` (como `has_obra_access`, mas exclui `obra_membros.papel = cliente` — cliente é leitura, `mvp.md` §2.7) + policies de escrita em despesas/despesa_itens/recibos/diario_entradas/diario_midia. Migration `supabase/migrations/20260901154315_escrita_despesas_recibo_diario.sql`, testada local e hospedado.
- **Route Handler** `src/app/api/storage/sign/route.ts`: recebe `{ kind, id, action, contentType }`, autoriza buscando a linha via client Supabase da sessão do usuário (RLS de `select` já é o `has_obra_access` — não confia em `obra_id` vindo do cliente, evita um "confused deputy"). Caminho no R2 vem do próprio `arquivo_url` da linha. Revisado ADR 0001/0003 pra refletir esse mecanismo (não é mais "RPC com obra_id do cliente").
- Testado com login real (`supabase-js`, não simulação SQL): usuário membro da obra lê o `arquivo_url` do recibo, usuário sem acesso não lê. HTTP end-to-end via Next.js dev server não testado (exigiria simular cookie de sessão de navegador) — `pnpm lint`/`pnpm build` confirmam que compila.
- `src/lib/storage/compress-image.ts`: compressão no cliente (Canvas API), sem wiring ainda — não existe tela de captura pra usar.
