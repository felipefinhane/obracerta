# Modelo de dados — MVP

> Cobre só o escopo definido em `docs/mvp.md`. Entidades da fase 2 (contratos, recebimentos, almoxarifado, documentos etc.) não estão aqui — serão desenhadas quando essas fases forem planejadas, para não travar decisões de schema em coisa que ainda pode mudar.

Notação: `tabela (campo tipo, ...)`. FK indicada por `-> tabela`. Pensado para Postgres/Supabase, com RLS filtrando a maioria das tabelas por `obra_id` a partir da associação do usuário em `obra_membros`.

---

## Núcleo: obra e acesso

Isolamento em **dois níveis** (decidido em `planejamento.md` seção 7): a construtora é o limite principal de tenant — a equipe de uma construtora nunca vê obras de outra construtora — e dentro disso, acesso fino por obra individual.

```
construtoras (
  id uuid pk,
  nome text,
  cnpj text
)

obras (
  id uuid pk,
  nome text,
  endereco text,
  cliente_nome text,
  construtora_id -> construtoras,
  valor_planejado_total numeric,
  data_inicio_prevista date,
  data_fim_prevista date,
  criado_em timestamptz
)

construtora_membros (
  id uuid pk,
  construtora_id -> construtoras,
  user_id -> auth.users (Supabase Auth),
  papel text  -- admin | engenheiro | financeiro
)

obra_membros (
  id uuid pk,
  obra_id -> obras,
  user_id -> auth.users (Supabase Auth),
  papel text  -- engenheiro | financeiro | cliente
)
```

**Como a RLS decide acesso a uma obra**: o usuário enxerga a obra se (a) tem uma linha em `construtora_membros` para a `construtora_id` daquela obra — dá acesso automático a todas as obras da construtora (uso típico: admin, engenheiro/financeiro que circulam entre obras) — **ou** (b) tem uma linha em `obra_membros` específica para aquela obra — acesso restrito a uma obra só (uso típico: cliente, que não deve ver outras obras da mesma construtora).

`obra_membros.papel = cliente` só faz sentido nesse segundo caminho — um cliente nunca deveria ter linha em `construtora_membros`.

---

## Planejamento

```
etapas (
  id uuid pk,
  obra_id -> obras,
  nome text,
  descricao text,
  valor_planejado numeric,
  peso_percentual numeric,       -- % sobre o valor total da obra
  ordem int,
  data_inicio_prevista date,
  data_fim_prevista date
)

medicoes (
  id uuid pk,
  etapa_id -> etapas,
  data date,
  percentual_concluido numeric,
  observacao text,
  criado_por -> auth.users
)
```

"Orçado vs. Realizado" não é tabela — é uma view/query que soma `despesas.valor` agrupado por `etapa_id` e compara com `etapas.valor_planejado`.

---

## Cadastros de apoio

Categorias e fornecedores são **compartilhados entre as obras da mesma construtora** (decidido em `planejamento.md` seção 7) — por isso ficam vinculados a `construtora_id`, não a `obra_id`. Cadastra uma vez, reusa em qualquer obra daquela construtora.

```
categorias (
  id uuid pk,
  construtora_id -> construtoras,
  nome text,
  tipo text,          -- produto | servico | mao_de_obra
  categoria_pai_id -> categorias (nullable, para subcategoria)
)

fornecedores (
  id uuid pk,
  construtora_id -> construtoras,
  nome text,
  cnpj_cpf text,
  telefone text
)
```

---

## Despesas e captura de recibo

```
despesas (
  id uuid pk,
  obra_id -> obras,
  etapa_id -> etapas (nullable até a confirmação vincular),
  categoria_id -> categorias (nullable até a confirmação),
  fornecedor_id -> fornecedores (nullable até a confirmação ou extração),
  valor numeric (nullable até extração/confirmação),
  data_despesa date (nullable até extração/confirmação),
  descricao text,
  origem text,          -- foto | manual
  status text,         -- pendente_confirmacao | confirmada
  forma_pagamento text,
  criado_por -> auth.users,
  criado_em timestamptz,
  confirmado_em timestamptz
)

despesa_itens (
  id uuid pk,
  despesa_id -> despesas,
  descricao text,
  quantidade numeric,
  valor_unitario numeric,
  valor_total numeric
)

recibos (
  id uuid pk,
  despesa_id -> despesas (unique — 1 recibo por despesa),
  arquivo_url text,                -- chave do objeto no Cloudflare R2 (ADR 0003), não URL resolvível direto; caminho determinístico (recibos/{id}.jpg), preenchido já no INSERT (não é flag de upload — ver status_processamento)
  tipo_documento text,             -- nfe | recibo_informal
  chave_acesso_nfe text (nullable),
  dados_extraidos jsonb,           -- payload cru vindo do pipeline de extração
  confianca_extracao numeric (nullable),  -- só para recibo_informal via OCR/LLM
  status_processamento text,       -- aguardando_upload | pendente | processado | falhou
  criado_em timestamptz
)
```

Fluxo (ver `planejamento.md` seção 3, ADR 0002 revisado e ADR 0003): `despesas` (origem `foto`) e `recibos` são criados no momento da foto, com `despesas` já em status `pendente_confirmacao` e campos nulos, e `recibos.status_processamento = aguardando_upload` — **antes** do upload da foto terminar, não depois. `arquivo_url` já é preenchido nesse INSERT com o caminho determinístico (é previsível a partir do `id`, não precisa esperar o upload). O cliente comprime a foto (ADR 0003) e pede uma URL assinada de upload a um Route Handler, que checa `has_obra_access` via RPC antes de emitir; o upload vai direto do cliente pro Cloudflare R2 com essa URL. Quando o upload confirma, o cliente atualiza `recibos.status_processamento` para `pendente`; um Database Webhook nessa transição (não mais no `INSERT`) dispara a Edge Function de extração, que busca o arquivo no R2, preenche `dados_extraidos` e marca `processado` ou `falhou`. Se o upload nunca confirma, o registro fica em `aguardando_upload` indefinidamente, disponível para retry manual — o reenvio reusa o mesmo registro e caminho, não cria um lançamento novo. Despesa lançada manualmente (origem `manual`) não gera linha em `recibos`; os campos já vêm preenchidos na criação. Na tela de confirmação, o usuário revisa `dados_extraidos`, preenche os campos que faltarem em `despesas`/`despesa_itens`, e o status vira `confirmada` — a foto em si é exibida via URL assinada de leitura, gerada sob demanda (bucket privado).

---

## Diário de obra

```
diario_entradas (
  id uuid pk,
  obra_id -> obras,
  etapa_id -> etapas (nullable),
  data date,
  descricao text,
  clima text,
  efetivo_presente int (nullable),
  ocorrencias text (nullable),
  criado_por -> auth.users,
  criado_em timestamptz
)

diario_midia (
  id uuid pk,
  diario_entrada_id -> diario_entradas,
  arquivo_url text,     -- chave do objeto no Cloudflare R2 (ADR 0003)
  tipo text              -- foto (só isso no MVP — vídeo fica pra fase 2, ver mvp.md)
)
```
