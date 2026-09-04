# Equipe da obra — convidar e listar cliente

Status: pending
Blocked by: 01

## Escopo

- `/obras/[obraId]/equipe`: form (e-mail) chamando `convidar_membro` com `p_obra_id` e papel fixo `cliente` (engenheiro/financeiro específico de uma obra só é caso raro — fica de fora do form por simplicidade, a função já aceita se precisar no futuro); lista de `obra_membros` dessa obra (`membros_obra_com_email`) e convites pendentes (`convites` onde `obra_id = esta obra`).
- Aba "Equipe" na `ObraSubNav` (`src/app/(app)/obras/[obraId]/ObraSubNav.tsx`).

## Comments
