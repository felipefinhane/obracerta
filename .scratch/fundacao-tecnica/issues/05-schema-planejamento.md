# Schema — planejamento (etapas, medições)

Status: open
Blocked by: 03

## Contexto

Ver `docs/modelo-dados.md` seção "Planejamento". É o núcleo do controle de obra (orçado vs. realizado).

## Escopo

- Tabelas `etapas` e `medicoes` — schema exato em `docs/modelo-dados.md`. Sem fluxo de aprovação formal na v1 (`mvp.md`).
- RLS via `has_obra_access` (ticket 03).
- View/query de "Orçado vs. Realizado": soma `despesas.valor` agrupado por `etapa_id` comparado com `etapas.valor_planejado` — **depende do ticket 06** (tabela `despesas`) pra existir de fato, mas o schema de `etapas`/`medicoes` em si não depende.

## Comments
