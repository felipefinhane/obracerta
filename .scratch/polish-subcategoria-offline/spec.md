# Fechando o MVP — subcategoria e resiliência offline básica

Status: done (item 3 com uma pendência de infra fora do meu alcance — ver Comments)

Itens 1 e 3 da lacuna identificada em 2026-09-04 ao revisar `docs/mvp.md`/`docs/planejamento.md` contra o que foi implementado. Item 2 (detecção de QR code/NF-e) fica pra outro momento, por pedido do usuário.

## Escopo

- **Item 1 — Subcategoria**: `categorias.categoria_pai_id` existe desde `fundacao-tecnica` mas nunca teve UI. Cadastro ganha um select opcional de "categoria pai" e a lista de `/cadastros` passa a mostrar a hierarquia (categoria → subcategorias indentadas).
- **Item 3 — Resiliência offline básica** (`docs/mvp.md` §1: "se o upload falhar por falta de sinal, o app guarda localmente e tenta reenviar quando a conexão voltar" — não é o PWA offline-first completo, que é fase 2): fila local em IndexedDB (`src/lib/storage/fila-offline.ts`) — se o `PUT` da foto pro R2 falhar (depois que o lançamento já foi criado no banco, que é a parte pequena e mais provável de completar mesmo em conexão ruim), a foto comprimida fica guardada no aparelho. Um componente sempre montado (`SincronizacaoOffline`, no layout logado inteiro) drena a fila sozinho quando o evento `online` dispara ou quando o app abre de novo. Aplicado nos dois fluxos que sobem foto do browser: captura de recibo e novo lançamento de diário (este último, por foto — uma foto falhando não trava as outras nem o lançamento de texto).

## Achado importante (não estava no escopo original, descoberto testando)

Testar isso de ponta a ponta pela primeira vez **num browser de verdade** (Playwright, não só `curl` replicando a sequência do lado do servidor como em todos os efforts anteriores) revelou que **o bucket R2 nunca teve CORS configurado**. Isso bloqueia qualquer `PUT` de upload feito por `fetch()` direto do browser — ou seja, **o fluxo de captura de recibo e de foto no diário nunca funcionou de verdade num navegador real**, em produção ou local, desde que foram implementados. Todos os testes "de ponta a ponta" anteriores desses dois efforts usaram `curl` pra reproduzir a sequência (porque a lógica de servidor é fina o bastante pra isso cobrir o código), o que **contorna CORS sem querer** — `curl` não é um browser, não aplica a mesma política. Isso nunca tinha sido pego até agora.

Detalhe técnico: CORS só afeta o `PUT` de upload (`fetch` com method/headers customizados, dispara preflight). A **leitura** da foto (`<img src={urlAssinada}>`) não é afetada — imagem simples não passa por CORS — por isso a tela de confirmação sempre mostrou a foto certinho nos testes anteriores, escondendo o problema.

Não consigo corrigir isso sozinho: a chave de API do R2 configurada neste projeto só tem permissão de leitura/escrita de objeto, não de administração do bucket (`PutBucketCors`/`GetBucketCors` retornam `AccessDenied`). Precisa de uma ação do usuário — ver comentário do ticket 03.

## Issues

01. Subcategoria em Cadastros
02. Fila offline (IndexedDB) + sincronização automática
03. Achado: CORS do bucket R2 nunca configurado — bloqueia upload real do browser

## Comments
