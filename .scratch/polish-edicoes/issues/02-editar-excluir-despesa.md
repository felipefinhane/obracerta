# Editar e excluir despesa confirmada

Status: done
Blocked by: 01

## Escopo

- `/obras/[obraId]/despesas/[despesaId]/editar`: form com fornecedor, categoria, etapa, data, valor, forma de pagamento, descrição (mesmos campos de "nova despesa manual"), pré-preenchido. Sem editar itens (`spec.md`).
- Botão de excluir na lista do extrato (`ExtratoDespesas`), com `confirm()` (mesmo padrão de `ExcluirEtapaForm`).
- Link de editar em cada linha do extrato.

## Comments

- `/obras/[obraId]/despesas/[despesaId]/editar` (mesmos campos de "nova despesa manual", sem itens). `ExtratoDespesas` ganhou link de editar e `excluirDespesa` (form inline com `confirm()`, já era Client Component).
- **Testado de ponta a ponta de verdade contra o hospedado**, com POST real do form (wire protocol): editei uma despesa real do dado de demonstração (mudei valor/descrição/zerei categoria-fornecedor-etapa), confirmei via REST, e restaurei os valores originais exatos depois (mesmo código de update, então a restauração também validou o caminho). Exclusão testada contra uma despesa descartável criada só pra isso (não mexi no dado de demo) — sumiu do banco depois do POST real.
