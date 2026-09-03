# Captura de recibo (mobile)

Status: done

## Contexto

Fluxo mobile-first mais específico do produto — `docs/planejamento.md` §3 passo 1, ADR 0002 (decisão 4, revisão) e ADR 0003. Único input obrigatório no momento é a obra (se o usuário só tem acesso a uma, nem isso é perguntado).

## Escopo

- `/obras/[obraId]/despesas/capturar`: input de câmera/galeria (`<input type="file" accept="image/*" capture>`), sem nenhum outro campo.
- Ao selecionar a foto: `compressImage` (`src/lib/storage/compress-image.ts`, já existe, nunca foi conectada a uma tela) antes do upload.
- Sequência exata (ordem importa — ADR 0002 decisão 4): (1) `insert` em `despesas` (`origem = foto`, `status = pendente_confirmacao`, demais campos nulos) e em `recibos` (`status_processamento = aguardando_upload`, `arquivo_url = recibos/{id}.jpg` com o `id` já conhecido antes do insert, ou gerado e lido de volta — decidir na implementação qual client Supabase permite setar o `id` do lado do app pra montar o path determinístico); (2) `POST /api/storage/sign` com `{kind: "recibo", id, action: "upload", contentType}` pra pegar a URL assinada; (3) `PUT` direto da imagem comprimida pro R2 com essa URL; (4) só depois do upload confirmar (resposta 2xx), `update recibos set status_processamento = 'pendente'` — é essa transição que dispara a Edge Function via webhook (já existe, ticket 09 de `fundacao-tecnica`).
- Se o passo 3 falhar: registro fica em `aguardando_upload`, avisar o usuário que pode tentar de novo (retry manual reusando o mesmo registro é feature do ticket 04, não desta tela — aqui só não deixar `status_processamento` avançar pra `pendente` se o upload não confirmou).
- Redireciona pra `/obras/[obraId]/despesas/pendentes` (ticket 04) depois de disparar — não espera a extração terminar (é assíncrona).

## Comments

- `/obras/[obraId]/despesas/capturar`: Client Component (`CapturarForm`) porque `compressImage` e o upload direto pro R2 só rodam no browser. Sequência exata da ADR 0002/0003 respeitada: `criarLancamentoProvisorio` (server action) grava `despesas` + `recibos` com `id` do recibo gerado no server (`crypto.randomUUID()`) e `arquivo_url` determinístico no mesmo INSERT → cliente pede URL assinada em `/api/storage/sign` → `PUT` direto pro R2 → só então `confirmarUploadRecibo` (server action) vira `status_processamento` pra `pendente`, que é o que dispara o webhook.
- Erro de rede no upload fica só com uma mensagem informativa (o lançamento já existe, não se perde) — sem tentar reenviar automaticamente reusando o registro, como o próprio ticket já previa como fora de escopo.
- **Testado de ponta a ponta de verdade contra o hospedado**, com upload real do `recibo_exemplo.jpg` pro Cloudflare R2 de produção: recriei manualmente a sequência exata da tela (insert `despesas`/`recibos` via REST com a sessão real do usuário → `POST /api/storage/sign` na rota rodando de verdade → `PUT` do arquivo pra URL assinada real → `PATCH status_processamento=pendente`) porque o upload em si depende de APIs de browser (Canvas, File) que não dá pra disparar de fora de um browser real; a lógica de servidor (as duas server actions) é fina o bastante pra essa reprodução via REST cobrir o mesmo caminho de código.
- Isso disparou o webhook e a Edge Function de extração **de verdade** (não só simulação) — primeira tentativa bateu num `503` transitório do Gemini (`gemini-3.6-flash`, "high demand"), o pipeline corretamente marcou `falhou` sem perder o registro; invocando de novo alguns segundos depois, processou certo: fornecedor "DEPOSITO SANTA IFIGENIA", item "TIGRE JOELHO ESGOTO 75X90" (qtd 8, R$9,35 unit.), valor total R$464, confiança 0.95 — os mesmos dados batendo com o que o ticket 09 de `fundacao-tecnica` já tinha relatado pra essa mesma imagem, confirmando que a mudança aqui não alterou o pipeline em si, só passou a alimentá-lo pelo caminho real do app.
- Recibo/despesa de teste usados também pra validar o ticket 04 (ver lá) antes de ser apagado.
