# Schema: recebimentos, transacoes_bancarias, RLS

Status: pending

## Contexto

Ver `spec.md` — decisões de produto já registradas ali.

## Escopo

```
recebimentos (
  id uuid pk,
  obra_id -> obras,
  etapa_id -> etapas (nullable),
  tipo text,           -- parcela_financiamento | aporte_cliente
  valor numeric not null,
  data date not null,
  descricao text,
  criado_por -> auth.users,
  criado_em timestamptz
)

transacoes_bancarias (
  id uuid pk,
  obra_id -> obras,
  data date not null,
  descricao text,
  valor numeric not null,     -- positivo = entrada, negativo = saída (padrão de extrato bancário)
  despesa_id -> despesas (nullable),
  recebimento_id -> recebimentos (nullable),
  -- check: nunca vinculado aos dois ao mesmo tempo
  criado_em timestamptz
)
```

- RLS: `select`/`insert` em `recebimentos` via `has_obra_access`/`has_obra_write_access` (mesmo padrão de `despesas`). `transacoes_bancarias` idem; `update` (só pra setar o vínculo) via `has_obra_write_access`.
- Constraint em `transacoes_bancarias`: `check (despesa_id is null or recebimento_id is null)`.

## Comments
