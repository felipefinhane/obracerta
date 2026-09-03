# Editar e excluir etapa

Status: pending
Blocked by: 01

## Contexto

`despesas-recibo`/01 criou um cadastro mínimo de etapas (criar+listar, só nome/valor/datas) só pra desbloquear os selects da despesa. Mockup `docs/stitch/stitch_obra_certa/{planejamento_de_etapas,planejamento_desktop}`.

## Escopo

- Estende `/obras/[obraId]/etapas`: form de criação ganha `peso_percentual` (%) e `ordem` (número), além dos campos que já existiam.
- Cada etapa da lista ganha um link "Editar" pra `/obras/[obraId]/etapas/[etapaId]/editar` (form pré-preenchido, todos os campos) e um botão de excluir (com confirmação simples do browser — `confirm()` ou equivalente, sem modal customizado).
- Sem recálculo automático de peso das outras etapas ao editar uma (fora de escopo, `spec.md`).
- Lista volta a ordenar por `ordem` (quando preenchido) em vez de `data_inicio_prevista` (comportamento atual do ticket mínimo).

## Comments
