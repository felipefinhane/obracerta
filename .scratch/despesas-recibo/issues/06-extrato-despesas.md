# Extrato de despesas

Status: pending
Blocked by: 02, 05

## Contexto

`docs/mvp.md` seção 1, "Relatórios": "Extrato de despesas por categoria/fornecedor/período". Mockup `docs/stitch/stitch_obra_certa/{extrato_de_despesas,extrato_de_despesas_desktop}`.

## Escopo

- `/obras/[obraId]/despesas`: lista despesas `confirmada` da obra (data, fornecedor, categoria, valor, forma de pagamento), com filtro por categoria, fornecedor e intervalo de datas (client-side é suficiente pro volume esperado no MVP — sem paginação).
- Total do período filtrado.
- Links de entrada pras outras telas do módulo: nova despesa manual (02), capturar recibo (03), recibos pendentes (04) — esta é a home do módulo Despesas dentro de uma obra.

## Comments
