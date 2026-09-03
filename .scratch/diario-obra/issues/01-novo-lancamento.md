# Novo lançamento de diário

Status: pending

## Contexto

`docs/mvp.md` seção 1 ("Diário de obra") e `docs/modelo-dados.md` ("Diário de obra"). Mockup `docs/stitch/stitch_obra_certa/novo_lan_amento_de_di_rio`. Diferente do fluxo de recibo (ADR 0002/0003), aqui não tem estado provisório nem extração — o lançamento nasce completo, com texto e foto(s) na mesma submissão.

## Escopo

- `/obras/[obraId]/diario/novo`: form com data (default hoje), clima (select simples — ensolarado/parcialmente nublado/nublado/chuvoso), descrição das atividades, efetivo presente (número, opcional), ocorrências (texto, opcional), etapa vinculada (select, opcional), input de foto múltiplo (`accept="image/*" multiple`).
- Client Component (mesmo motivo de `despesas/capturar`: compressão de imagem e upload direto pro R2 só rodam no browser): submissão cria `diario_entradas` primeiro (todos os campos de texto), depois, pra cada foto selecionada, cria uma linha em `diario_midia` (`id` gerado no cliente/server como em recibos, `arquivo_url` determinístico `diario/{id}.jpg`), pede URL assinada de upload em `/api/storage/sign` (`kind: diario_midia`) e sobe direto pro R2 — sequencial, sem necessidade da dança de `status_processamento` dos recibos (não tem pipeline assíncrono aqui).
- Reusa `compressImage` (`src/lib/storage/compress-image.ts`).

## Comments
