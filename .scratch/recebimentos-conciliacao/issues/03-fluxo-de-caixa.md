# Fluxo de caixa (relatório)

Status: done
Blocked by: 02

## Escopo

- `/obras/[obraId]/fluxo-de-caixa`: entradas (`recebimentos`) e saídas (`despesas` `confirmada`) agrupadas por mês, total de entradas/saídas/saldo do período e saldo acumulado.
- Mesmo estilo visual dos outros relatórios (`orcado-realizado`).

## Comments

- `/obras/[obraId]/fluxo-de-caixa`: agrupamento por mês feito em memória no Server Component (sem view nova — volume baixo o suficiente pra não precisar).
- **Testado de ponta a ponta de verdade contra o hospedado**: conferi que o total de saídas (R$202.100,00) bate exatamente com a soma manual das despesas confirmadas com data da obra de demonstração, entradas (R$120.000,00) bate com o recebimento do ticket 02, e o saldo (-R$82.100,00) sai negativo e destacado — obra ainda gastando mais do que recebeu, esperado nessa fase do cenário fictício.
