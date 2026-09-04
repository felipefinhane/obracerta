# Achado: CORS do bucket R2 nunca configurado

Status: resolvido — usuário aplicou o CORS direto no painel da Cloudflare

## O problema

O bucket Cloudflare R2 usado pelo projeto (`R2_BUCKET_NAME` em `.env.local`) não tem política de CORS configurada. Isso bloqueia qualquer upload feito via `fetch()` direto do navegador pra URL assinada — que é exatamente como `CapturarForm` (captura de recibo) e `NovoLancamentoForm` (foto no diário) fazem o upload da foto.

**Efeito prático: a captura de recibo e o upload de foto no diário nunca funcionaram de verdade num navegador real**, nem local nem em produção, desde que foram implementados (`despesas-recibo`/03 e `diario-obra`/01). Todos os testes de ponta a ponta anteriores desses dois tickets usaram `curl` pra reproduzir a sequência de chamadas (documentado como "a lógica de servidor é fina o bastante pra essa reprodução via REST cobrir o mesmo caminho de código") — o que sem querer contornava o problema, porque `curl` não é um navegador e não aplica política de CORS. Só apareceu agora, testando com um Chromium de verdade (Playwright) pela primeira vez.

Só a leitura da foto (`<img src={urlAssinada}>`, usada na confirmação e no diário) não é afetada — carregar imagem simples não passa por CORS — por isso a foto sempre apareceu certinho nos testes visuais anteriores, escondendo o problema do upload.

## Por que não consegui corrigir sozinho

Tentei aplicar a política via API (`PutBucketCorsCommand`, `@aws-sdk/client-s3`) com as credenciais já configuradas no projeto (`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`) — recebi `AccessDenied` tanto pra ler quanto pra escrever a configuração de CORS. Essa chave de API do R2 tem permissão de **objeto** (ler/escrever arquivo dentro do bucket), não de **administração do bucket** (configurar CORS é uma operação de bucket, exige um token com escopo maior no painel da Cloudflare).

## O que precisa acontecer

Uma destas duas:
1. **O usuário aplica a política de CORS direto no painel da Cloudflare** (R2 → bucket → Settings → CORS Policy), colando este JSON:
   ```json
   [
     {
       "AllowedOrigins": [
         "http://localhost:3000",
         "https://obracerta-delta.vercel.app",
         "https://*.vercel.app"
       ],
       "AllowedMethods": ["GET", "PUT", "HEAD"],
       "AllowedHeaders": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
2. **O usuário cria um token de API do R2 com permissão de administração do bucket** (não só leitura/escrita de objeto) e me passa as credenciais, pra eu aplicar via API e depois substituir de volta pela chave de escopo menor (a chave usada pelo Route Handler de URL assinada deve continuar sendo a de escopo mínimo — objeto só).

Nenhuma mudança de código é necessária depois disso — a captura de recibo, o diário com foto e a fila offline (ticket 02) já estão prontos e devem funcionar assim que o CORS existir.

## Comments

- Usuário aplicou a política de CORS no painel da Cloudflare (2026-09-04). Minha chave de API continua sem permissão de leitura/escrita de CORS (`GetBucketCorsCommand` ainda dá `AccessDenied` com a chave de escopo objeto) — não consigo confirmar o conteúdo exato da política aplicada por essa via, só o efeito prático.
- **Confirmado de ponta a ponta de verdade com um browser real (Playwright)**, dessa vez sem bloquear nada: capturei o `recibo_exemplo.jpg` do zero pela tela de verdade — upload do browser pro R2 funcionou sem erro de CORS no console, a tela navegou pra "pendentes" (sucesso real, não o estado "guardado no aparelho"), e confirmei três coisas independentes do lado do servidor: (1) `recibos.status_processamento` avançou pra `pendente` (prova que `confirmarUploadRecibo` rodou depois de um upload que realmente completou); (2) o objeto existe de verdade no R2 (`HeadObjectCommand`, 108238 bytes, `image/jpeg`); (3) invocando a Edge Function manualmente, ela conseguiu baixar o arquivo do R2 e chamar o Gemini, retornando uma extração completa e correta (fornecedor, 3 itens, confiança 0.98) — só não fechou como `processado` por uma condição de corrida das minhas próprias invocações manuais repetidas (não é um bug real de uso normal, onde o webhook dispara uma vez só).
- Também re-testei a fila offline (ticket 02) inteira, agora até o fim: bloqueei só as requests pro R2, capturei uma foto (guardou no IndexedDB, UI mostrou "Guardado no aparelho"), desbloqueei, naveguei pra `/obras` — o componente `SincronizacaoOffline` reenviou sozinho, o badge de pendente sumiu, o IndexedDB ficou vazio, e `status_processamento` do recibo confirmou `pendente` no servidor. **A resiliência offline básica (item 3) está confirmada funcionando de ponta a ponta agora, não só até o ponto em que o CORS bloqueava.**
- Todo dado de teste (2 despesas/recibos + os 2 objetos correspondentes no R2) apagado ao final.
