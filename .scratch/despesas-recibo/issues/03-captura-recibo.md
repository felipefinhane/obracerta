# Captura de recibo (mobile)

Status: pending

## Contexto

Fluxo mobile-first mais específico do produto — `docs/planejamento.md` §3 passo 1, ADR 0002 (decisão 4, revisão) e ADR 0003. Único input obrigatório no momento é a obra (se o usuário só tem acesso a uma, nem isso é perguntado).

## Escopo

- `/obras/[obraId]/despesas/capturar`: input de câmera/galeria (`<input type="file" accept="image/*" capture>`), sem nenhum outro campo.
- Ao selecionar a foto: `compressImage` (`src/lib/storage/compress-image.ts`, já existe, nunca foi conectada a uma tela) antes do upload.
- Sequência exata (ordem importa — ADR 0002 decisão 4): (1) `insert` em `despesas` (`origem = foto`, `status = pendente_confirmacao`, demais campos nulos) e em `recibos` (`status_processamento = aguardando_upload`, `arquivo_url = recibos/{id}.jpg` com o `id` já conhecido antes do insert, ou gerado e lido de volta — decidir na implementação qual client Supabase permite setar o `id` do lado do app pra montar o path determinístico); (2) `POST /api/storage/sign` com `{kind: "recibo", id, action: "upload", contentType}` pra pegar a URL assinada; (3) `PUT` direto da imagem comprimida pro R2 com essa URL; (4) só depois do upload confirmar (resposta 2xx), `update recibos set status_processamento = 'pendente'` — é essa transição que dispara a Edge Function via webhook (já existe, ticket 09 de `fundacao-tecnica`).
- Se o passo 3 falhar: registro fica em `aguardando_upload`, avisar o usuário que pode tentar de novo (retry manual reusando o mesmo registro é feature do ticket 04, não desta tela — aqui só não deixar `status_processamento` avançar pra `pendente` se o upload não confirmou).
- Redireciona pra `/obras/[obraId]/despesas/pendentes` (ticket 04) depois de disparar — não espera a extração terminar (é assíncrona).

## Comments
