# Equipe da obra — convidar e listar cliente

Status: done
Blocked by: 01

## Escopo

- `/obras/[obraId]/equipe`: form (e-mail) chamando `convidar_membro` com `p_obra_id` e papel fixo `cliente` (engenheiro/financeiro específico de uma obra só é caso raro — fica de fora do form por simplicidade, a função já aceita se precisar no futuro); lista de `obra_membros` dessa obra (`membros_obra_com_email`) e convites pendentes (`convites` onde `obra_id = esta obra`).
- Aba "Equipe" na `ObraSubNav` (`src/app/(app)/obras/[obraId]/ObraSubNav.tsx`).

## Comments

- `/obras/[obraId]/equipe`: mesmo padrão do ticket 02, escopado pra `obra_id` (papel fixo `cliente`). Aba "Equipe" adicionada à `ObraSubNav`.
- **Testado de ponta a ponta de verdade contra o hospedado**, mesmo método do ticket 02 (POST real do form + simulação de cadastro real via admin API): convite de cliente pra esta obra específica apareceu como pendente e depois como membro após o cadastro simulado — confirma que o convite obra-scoped (com `p_obra_id`) funciona pelo caminho real da UI, não só via chamada direta testada no ticket 01. Dado de teste apagado ao final.
