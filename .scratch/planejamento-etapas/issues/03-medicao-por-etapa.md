# Medição por etapa

Status: pending
Blocked by: 01

## Contexto

`docs/mvp.md` seção 1: "Medição simplificada: % concluído por etapa, com data e observação. Sem fluxo de aprovação formal na v1." Schema `medicoes` já existe (`fundacao-tecnica`/05): `etapa_id`, `data`, `percentual_concluido`, `observacao`, `criado_por`.

## Escopo

- `/obras/[obraId]/etapas/[etapaId]/medicoes`: form (data, % concluído, observação opcional) + histórico das medições já lançadas daquela etapa, mais recente primeiro.
- Sem edição/exclusão de medição já lançada (`spec.md`).
- Link de acesso a partir de cada etapa em `/obras/[obraId]/etapas` (ticket 02).

## Comments
