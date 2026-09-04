# Conciliação bancária: importar CSV + vincular

Status: pending
Blocked by: 01

## Contexto

Só CSV nesta v1 (sem OFX) e sem matching automático — ver decisões em `spec.md`.

## Escopo

- `/obras/[obraId]/conciliacao`: upload de CSV (`data,descricao,valor`, com cabeçalho) — parse no próprio Server Action (arquivo pequeno, sem necessidade de R2/URL assinada, diferente do fluxo de foto de recibo/diário), grava uma linha em `transacoes_bancarias` por linha do CSV.
- Lista as transações importadas, cada uma com select pra vincular a uma despesa ou recebimento existente da obra (ou deixar sem vínculo); transação vinculada mostra o vínculo, sem select.
- Nova aba "Conciliação" na `ObraSubNav`.

## Comments
