# Conciliação bancária: importar CSV + vincular

Status: done
Blocked by: 01

## Contexto

Só CSV nesta v1 (sem OFX) e sem matching automático — ver decisões em `spec.md`.

## Escopo

- `/obras/[obraId]/conciliacao`: upload de CSV (`data,descricao,valor`, com cabeçalho) — parse no próprio Server Action (arquivo pequeno, sem necessidade de R2/URL assinada, diferente do fluxo de foto de recibo/diário), grava uma linha em `transacoes_bancarias` por linha do CSV.
- Lista as transações importadas, cada uma com select pra vincular a uma despesa ou recebimento existente da obra (ou deixar sem vínculo); transação vinculada mostra o vínculo, sem select.
- Nova aba "Conciliação" na `ObraSubNav`.

## Comments

- `/obras/[obraId]/conciliacao`: parser de CSV simples (sem dependência externa, três colunas fixas) direto no Server Action — arquivo pequeno, sem necessidade de R2/URL assinada como recibo/diário (essas passam por lá por causa da extração assíncrona e do carrossel de fotos; aqui é só parse e insert). Vínculo via select (despesa ou recebimento), sem matching automático (`spec.md`).
- **Testado de ponta a ponta de verdade contra o hospedado**: upload real de um CSV de 3 linhas via `multipart/form-data` (POST real do form, arquivo de verdade, não simulação) — as 3 transações apareceram certas (uma entrada, duas saídas, valores negativos destacados em vermelho). Vinculei uma delas a uma despesa real da obra de demonstração via POST real do form de vínculo — confirmado via REST (`despesa_id` preenchido) e visualmente (a tela trocou o select pela descrição da despesa vinculada). Dados mantidos como parte do cenário de demonstração (mostra os dois estados: vinculado e pendente de vínculo).
