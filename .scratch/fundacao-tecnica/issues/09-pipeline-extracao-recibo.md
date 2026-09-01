# Pipeline de extração de recibo (Edge Function + Database Webhook)

Status: open
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
