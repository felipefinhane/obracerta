# Fila offline (IndexedDB) + sincronização automática

Status: done — confirmado de ponta a ponta depois do CORS ser corrigido (ticket 03)

## Escopo

- `src/lib/storage/fila-offline.ts`: wrapper de IndexedDB (`salvarUploadPendente`, `listarUploadsPendentes`, `removerUploadPendente`).
- `src/lib/storage/processar-fila-offline.ts`: drena a fila — pede URL assinada nova (a antiga expira em 5min), reenvia o blob, confirma o recibo se for o caso. Reenvio é idempotente (mesmo caminho no R2).
- `SincronizacaoOffline` (novo, montado em `(app)/layout.tsx` — não só na tela de captura, pra sincronizar mesmo que o usuário já tenha saído dali): roda ao montar e a cada evento `online`; mostra um indicador flutuante com a contagem de pendentes.
- `CapturarForm`: se o upload falhar depois do lançamento já criado, guarda a foto e mostra "Guardado no aparelho" em vez de só erro genérico.
- `NovoLancamentoForm` (diário): mesma lógica por foto — uma foto falhando guarda ela e segue pras outras, não aborta o lançamento inteiro (o texto já foi salvo de qualquer jeito).

## Comments

- **Testado de ponta a ponta de verdade com um browser real** (Playwright, Chromium headless, sessão real via cookie) — não só `curl`, justamente pra evitar o ponto cego que gerou o achado do ticket 03. Simulei falha de conexão bloqueando só as requests pro domínio do R2 (`context.route(...).abort()`), deixando o resto do app funcionando normal — mais realista que derrubar a conexão inteira (o que também mataria o Server Action de criar o lançamento, cenário diferente do que o texto do `mvp.md` descreve).
- Confirmado: UI mostrou "Guardado no aparelho"; inspecionei o IndexedDB direto do browser via `page.evaluate` e o registro estava lá, certo (id do recibo, tipo, `contentType`, blob com o tamanho real da foto comprimida).
- Depois que o usuário aplicou o CORS no R2 (ticket 03), repeti o teste completo: bloqueei só as requests pro R2 pra forçar o "guardado no aparelho", desbloqueei, naveguei pra `/obras` — `SincronizacaoOffline` reenviou sozinho, badge sumiu, IndexedDB esvaziou, e `recibos.status_processamento` confirmou `pendente` no servidor (prova que `confirmarUploadRecibo` rodou depois do reenvio automático). Sem nenhuma mudança de código necessária — a lógica escrita antes do CORS existir já estava certa.
