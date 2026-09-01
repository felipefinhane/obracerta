# Pipeline de extração de recibo (Edge Function + Database Webhook)

Status: done — exceto detecção de QR/NFe, ver comentário
Blocked by: 06, 08

## Contexto

Ver `docs/planejamento.md` §3 (fluxo funcional) e `docs/adr/0002-pipeline-captura-de-recibo.md` (revisado) pro desenho completo.

## Escopo

- Supabase Edge Function (não Route Handler do Vercel — limite de duração, ADR 0002 decisão 1) que roda o pipeline de extração: detecção de QR code/chave de acesso NF-e primeiro, fallback OCR + LLM de visão (Google Gemini, família Flash, tier gratuito — `planejamento.md` §8) pra recibo informal.
- Database Webhook disparando a Edge Function na transição de `recibos.status_processamento` para `pendente` (**não** no `INSERT` — revisão registrada no ADR 0002, causa raiz: o arquivo não existe no Storage no momento do `INSERT`).
- Edge Function busca o arquivo no R2 via credenciais S3-compatíveis (secrets do ticket 08).
- Resultado preenche `recibos.dados_extraidos` e marca `status_processamento` como `processado` ou `falhou`; parcial/baixa confiança ainda conta como `processado` (fica pro usuário revisar na confirmação, `planejamento.md` §3).

## Fora de escopo

A tela de confirmação em si (UI, fica pro effort de Despesas). Migração do provedor de extração pra Claude Sonnet 5 (fase 2, `planejamento.md` §6).

## Comments

- `supabase/functions/extrair-recibo/index.ts`: baixa o arquivo do R2 (via URL assinada + `fetch`, não pelo helper de stream do SDK — bateu num bug de compat `ERR_OUT_OF_RANGE` no runtime Deno das Edge Functions, contornado), chama Gemini (`gemini-3.6-flash` — `2.5-flash` foi descontinuado, a própria API sugeriu o substituto) com schema JSON estruturado, grava `dados_extraidos`/`confianca_extracao`/`status_processamento` de volta.
- **Detecção de QR code/chave de acesso NF-e NÃO implementada** — sempre cai no fallback de OCR/LLM. Não temos uma nota fiscal real de teste com QR code (`recibo_exemplo.jpg` é um recibo informal); melhor deixar como TODO explícito no código do que escrever algo não testado contra imagem real.
- Deployada no projeto hospedado (`supabase functions deploy`), secrets configurados (`supabase secrets set` — R2 + Gemini).
- Webhook: `supabase_functions.http_request` (o helper que o dashboard geraria) não está disponível nesse projeto sem habilitar Database Webhooks pela UI primeiro — usei `pg_net` direto (migration `20260901155030_webhook_extracao_recibo.sql`), trigger em `recibos` na transição pra `status_processamento = 'pendente'`.
- **Testado de ponta a ponta de verdade, duas vezes**: (1) invocando a function manualmente com o payload que o webhook manda; (2) fazendo só um `UPDATE status_processamento = 'pendente'` via REST (como o app faria depois do upload) e conferindo que o pipeline inteiro rodou sozinho — sem eu chamar nada a mais. Extração real do `recibo_exemplo.jpg`: fornecedor, itens, valores e confiança saíram corretos nas duas vezes. Dados de teste limpos depois (construtora/obra/despesa/recibo no banco, objeto no R2).
- URL da Edge Function e a anon key (pública, sem risco) ficaram hardcoded na migration do trigger — é configuração específica deste projeto hospedado, não portável. Nota no próprio SQL.
