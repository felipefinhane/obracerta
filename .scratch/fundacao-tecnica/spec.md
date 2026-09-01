# Fundação técnica

Status: open

Tudo que precisa existir antes de qualquer tela do MVP funcionar: scaffold do projeto, schema SQL completo com RLS, storage de arquivo e o pipeline de captura de recibo. Nenhuma UI de módulo (Obras, Planejamento, Despesas, Diário) entra aqui — isso vira efforts separados depois que essa fundação estiver de pé.

## Escopo

Cobre as decisões já fechadas em:
- `docs/mvp.md` — escopo funcional do MVP
- `docs/modelo-dados.md` — schema completo
- `docs/planejamento.md` — stack e fluxo de captura de recibo (seção 3, 4, 8)
- `docs/adr/0001-sem-orm-acesso-via-supabase-js.md` — sem ORM, RLS como fonte de verdade
- `docs/adr/0002-pipeline-captura-de-recibo.md` — arquitetura do pipeline de extração
- `docs/adr/0003-storage-cloudflare-r2-url-assinada.md` — storage via R2 + URL assinada

Fora de escopo aqui (fica pra depois): qualquer tela/componente de UI, consulta de NF-e via SEFAZ, migração do provedor de extração pra Claude, infra AWS pós-teste.

## Issues

01. Scaffold Next.js (App Router) + estrutura de pastas por módulo
02. Setup Supabase (CLI local via Docker + projeto hospedado)
03. Schema — núcleo de acesso (construtoras, obras, membros) + funções RLS auxiliares
04. Schema — cadastros de apoio (categorias, fornecedores)
05. Schema — planejamento (etapas, medições)
06. Schema — despesas e recibo
07. Schema — diário de obra
08. Storage — bucket R2 + Route Handler de URL assinada
09. Pipeline de extração de recibo (Edge Function + Database Webhook)

Ordem sugerida: 01 e 02 em paralelo (bloqueiam tudo); 03 bloqueia 04-07 (todas dependem das funções RLS auxiliares); 08 é independente de 03-07, mas bloqueia 09; 09 depende de 06 (schema de `recibos`) e 08 (storage).

## Comments
