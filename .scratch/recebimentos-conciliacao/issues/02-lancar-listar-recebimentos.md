# Lançar e listar recebimentos por obra

Status: done
Blocked by: 01

## Escopo

- `/obras/[obraId]/recebimentos`: form (tipo, valor, data, etapa vinculada opcional, descrição) + lista dos recebimentos já lançados, mais recente primeiro.
- Nova aba "Recebimentos" na `ObraSubNav`.
- Sem edição/exclusão (`spec.md`).

## Comments

- `/obras/[obraId]/recebimentos` + aba na `ObraSubNav`.
- **Testado de ponta a ponta de verdade contra o hospedado**: POST real do form (wire protocol) lançou uma parcela de financiamento de R$120.000 na obra de demonstração ("Residencial Vista Alegre") — mantido como dado real do cenário (representa a liberação após a Fundação), não é lixo de teste.
