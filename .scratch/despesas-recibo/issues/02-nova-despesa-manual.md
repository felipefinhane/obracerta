# Nova despesa manual

Status: pending
Blocked by: 01

## Contexto

Ver `docs/mvp.md` seção 1 ("Despesas + captura de recibo") e mockup `docs/stitch/stitch_obra_certa/{nova_despesa_manual,nova_despesa_manual_desktop}`. `CONTEXT.md`: despesa de origem `manual` nunca tem `recibo` associado.

## Escopo

- `/obras/[obraId]/despesas/nova`: form com fornecedor (select, `fornecedores` da construtora), data, valor total, forma de pagamento, categoria (select), etapa vinculada (select, opcional), descrição, itens da despesa (repetível: descrição/quantidade/valor unitário — `despesa_itens`).
- Ao salvar: `insert` em `despesas` com `origem = manual`, `status = confirmada`, `confirmado_em = now()`, `criado_por` = usuário da sessão; itens em `despesa_itens` vinculados ao `id` gerado.
- Sem `recibos` — nunca criar linha nessa tabela pra despesa manual (`CONTEXT.md`).

## Comments
