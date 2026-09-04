# Fila offline (IndexedDB) + sincronização automática

Status: done (código completo e testado; sincronização automática de verdade depende do ticket 03)

## Escopo

- `src/lib/storage/fila-offline.ts`: wrapper de IndexedDB (`salvarUploadPendente`, `listarUploadsPendentes`, `removerUploadPendente`).
- `src/lib/storage/processar-fila-offline.ts`: drena a fila — pede URL assinada nova (a antiga expira em 5min), reenvia o blob, confirma o recibo se for o caso. Reenvio é idempotente (mesmo caminho no R2).
- `SincronizacaoOffline` (novo, montado em `(app)/layout.tsx` — não só na tela de captura, pra sincronizar mesmo que o usuário já tenha saído dali): roda ao montar e a cada evento `online`; mostra um indicador flutuante com a contagem de pendentes.
- `CapturarForm`: se o upload falhar depois do lançamento já criado, guarda a foto e mostra "Guardado no aparelho" em vez de só erro genérico.
- `NovoLancamentoForm` (diário): mesma lógica por foto — uma foto falhando guarda ela e segue pras outras, não aborta o lançamento inteiro (o texto já foi salvo de qualquer jeito).

## Comments

- **Testado de ponta a ponta de verdade com um browser real** (Playwright, Chromium headless, sessão real via cookie) — não só `curl`, justamente pra evitar o ponto cego que gerou o achado do ticket 03. Simulei falha de conexão bloqueando só as requests pro domínio do R2 (`context.route(...).abort()`), deixando o resto do app funcionando normal — mais realista que derrubar a conexão inteira (o que também mataria o Server Action de criar o lançamento, cenário diferente do que o texto do `mvp.md` descreve).
- Confirmado: UI mostrou "Guardado no aparelho"; inspecionei o IndexedDB direto do browser via `page.evaluate` e o registro estava lá, certo (id do recibo, tipo, `contentType`, blob com o tamanho real da foto comprimida).
- A parte de "reenviar sozinho quando a conexão voltar" está implementada e o código está correto, mas **não terminei de confirmar de ponta a ponta** porque bati no achado do ticket 03 (CORS do bucket nunca configurado) — o `PUT` de reenvio falha pelo mesmo motivo que o `PUT` original falharia num browser real, independente da minha fila. Assim que o CORS for corrigido (ticket 03), a sincronização deve funcionar sem nenhuma mudança de código adicional — a lógica em si já foi validada até o ponto em que o CORS bloqueia.
