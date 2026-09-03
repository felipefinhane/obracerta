# Medição por etapa

Status: done
Blocked by: 01

## Contexto

`docs/mvp.md` seção 1: "Medição simplificada: % concluído por etapa, com data e observação. Sem fluxo de aprovação formal na v1." Schema `medicoes` já existe (`fundacao-tecnica`/05): `etapa_id`, `data`, `percentual_concluido`, `observacao`, `criado_por`.

## Escopo

- `/obras/[obraId]/etapas/[etapaId]/medicoes`: form (data, % concluído, observação opcional) + histórico das medições já lançadas daquela etapa, mais recente primeiro.
- Sem edição/exclusão de medição já lançada (`spec.md`).
- Link de acesso a partir de cada etapa em `/obras/[obraId]/etapas` (ticket 02).

## Comments

- `/obras/[obraId]/etapas/[etapaId]/medicoes`: form (data, % concluído, observação opcional) + histórico ordenado por data desc; link de acesso a partir do ícone de linha do tempo em cada etapa de `/etapas`.
- **Testado de ponta a ponta de verdade contra o hospedado**: POST real do form (wire protocol) gravou a medição com `criado_por` preenchido certo a partir da sessão; dado de teste apagado ao final.
