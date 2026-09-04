# Achado: CORS do bucket R2 nunca configurado

Status: bloqueado — precisa de ação do usuário (fora do meu alcance com as credenciais atuais)

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
