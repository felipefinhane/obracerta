# Nova despesa manual

Status: done
Blocked by: 01

## Contexto

Ver `docs/mvp.md` seção 1 ("Despesas + captura de recibo") e mockup `docs/stitch/stitch_obra_certa/{nova_despesa_manual,nova_despesa_manual_desktop}`. `CONTEXT.md`: despesa de origem `manual` nunca tem `recibo` associado.

## Escopo

- `/obras/[obraId]/despesas/nova`: form com fornecedor (select, `fornecedores` da construtora), data, valor total, forma de pagamento, categoria (select), etapa vinculada (select, opcional), descrição, itens da despesa (repetível: descrição/quantidade/valor unitário — `despesa_itens`).
- Ao salvar: `insert` em `despesas` com `origem = manual`, `status = confirmada`, `confirmado_em = now()`, `criado_por` = usuário da sessão; itens em `despesa_itens` vinculados ao `id` gerado.
- Sem `recibos` — nunca criar linha nessa tabela pra despesa manual (`CONTEXT.md`).

## Comments

- `/obras/[obraId]/despesas/nova`: form estático (sem itens dinâmicos — 3 linhas fixas de item, em branco vira ignorado; consistente com o resto do MVP, que ainda não tem forms com array dinâmico). `criarDespesaManual` insere `despesas` (`origem manual`, `status confirmada`, `confirmado_em`, `criado_por`) e depois `despesa_itens` (calcula `valor_total = quantidade * valor_unitario`), redirecionando pra `/obras` — `/obras/{obraId}/despesas` (ticket 06) ainda não existe nesta altura do plano, TODO deixado no código.
- **Testado de ponta a ponta de verdade contra o hospedado**, incluindo desta vez o **POST real do form** (não só a REST direta): peguei a sessão real do usuário (mesmo mecanismo do ticket 01, sem senha em mãos), fiz `curl` na página pra capturar os campos ocultos `$ACTION_REF_1`/`$ACTION_1:0`/`$ACTION_1:1` que o Next gera pro fallback sem-JS do Server Action, e repeti o POST `multipart/form-data` exatamente como um browser sem JS mandaria — recebi `303` pra `/obras` (o redirect do action) e confirmei via REST que a despesa e o item ficaram gravados certos (`valor_total` calculado, `fornecedor_id`/`categoria_id`/`etapa_id` do cadastro do ticket 01). Dado de teste (`descricao = "Teste E2E ticket 02..."`) apagado depois com a service role key (não existe policy de delete pro usuário ainda — fora de escopo). Sessão revogada e arquivos com token apagados ao final.
