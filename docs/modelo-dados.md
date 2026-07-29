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
  despesa_id -> despesas,
  arquivo_url text,               -- Supabase Storage
  tipo_documento text,            -- nfe | recibo_informal
  chave_acesso_nfe text (nullable),
  dados_extraidos jsonb,          -- payload cru vindo do pipeline de extração
  confianca_extracao numeric (nullable),  -- só para recibo_informal via OCR/LLM
  status_processamento text,      -- pendente | processado | falhou
  geolocalizacao point (nullable),
  criado_em timestamptz
)
```

Fluxo (ver `planejamento.md` seção 3): `recibos` é criado no momento da foto, com `despesas` associada já em status `pendente_confirmacao` e campos nulos. O pipeline assíncrono preenche `dados_extraidos` e `status_processamento`. Na tela de confirmação, o usuário revisa `dados_extraidos`, preenche os campos que faltarem em `despesas`/`despesa_itens`, e o status vira `confirmada`.

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
  arquivo_url text,     -- Supabase Storage
  tipo text              -- foto | video
)
```

---

## Pontos em aberto no modelo

- **`despesas` com campos nullable até confirmação**: funciona para o fluxo de recibo, mas para despesa lançada manualmente (sem foto) os campos já vêm preenchidos direto — o schema suporta os dois casos, só confirmar que não precisa de tabela separada para isso.
- **Geolocalização do recibo**: incluí como nullable/opcional; avaliar se vale a pena mesmo ou se é dado que ninguém vai usar no MVP.
