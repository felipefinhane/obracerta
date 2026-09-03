# Extrato de despesas

Status: done
Blocked by: 02, 05

## Contexto

`docs/mvp.md` seção 1, "Relatórios": "Extrato de despesas por categoria/fornecedor/período". Mockup `docs/stitch/stitch_obra_certa/{extrato_de_despesas,extrato_de_despesas_desktop}`.

## Escopo

- `/obras/[obraId]/despesas`: lista despesas `confirmada` da obra (data, fornecedor, categoria, valor, forma de pagamento), com filtro por categoria, fornecedor e intervalo de datas (client-side é suficiente pro volume esperado no MVP — sem paginação).
- Total do período filtrado.
- Links de entrada pras outras telas do módulo: nova despesa manual (02), capturar recibo (03), recibos pendentes (04) — esta é a home do módulo Despesas dentro de uma obra.

## Comments

- `/obras/[obraId]/despesas`: Server Component busca `despesas` `confirmada` com `categorias`/`fornecedores` embutidos + as listas completas de categoria/fornecedor (pros selects de filtro); `ExtratoDespesas` (Client Component) faz o filtro por categoria/fornecedor/intervalo de data e soma o total, tudo em memória — sem paginação nem filtro no servidor, conforme o escopo. Vira a home do módulo: links pra capturar recibo, nova despesa manual e pendentes.
- Corrigi os dois `TODO` deixados nos tickets 02 e 05 agora que a rota existe: `criarDespesaManual` passou a redirecionar pra cá; `confirmarDespesa` continua voltando pra `/pendentes` de propósito (fluxo de confirmar vários lançamentos em sequência, não um por vez).
- Também extraí a autorização de `/api/storage/sign` pra `src/lib/storage/signed-url.ts` durante o ticket 05 (reusada pelo Route Handler e por Server Components) — sem mudança de comportamento, só reorganização; citado aqui porque termina de fechar o effort.
- **Testado de ponta a ponta de verdade contra o hospedado**: com a mesma despesa que passou pelos tickets 03/05 (a extração real do `recibo_exemplo.jpg`, já confirmada), a página renderizou "Depósito Central" e o total "R$ 464,00" corretamente vindos do server. Despesa/recibo/item de teste apagados ao final (`DELETE` via service role — cascade cuidou de `despesa_itens`/`recibos`) e o objeto correspondente removido do R2 de produção também, pra não deixar lixo no bucket real. Sessão de teste revogada e `.env.local` restaurado por último.
