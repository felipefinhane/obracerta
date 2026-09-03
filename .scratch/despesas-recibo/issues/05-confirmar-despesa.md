# Confirmar despesa

Status: pending
Blocked by: 01, 04

## Contexto

Mockup `docs/stitch/stitch_obra_certa/{confirmar_despesa,confirmar_despesa_desktop}`. `docs/planejamento.md` §3 passo 3. Schema de `recibos.dados_extraidos` vem do pipeline (`supabase/functions/extrair-recibo/index.ts`): `{ fornecedor, data, valor_total, itens: [{descricao, quantidade, valor_unitario, valor_total}], confianca }` — **confiança é única pro recibo inteiro, não por campo** (o pipeline não gera isso granular); "campo de baixa confiança destacado" do mockup vira, na prática, destacar todos os campos vindos da extração quando `confianca_extracao` estiver abaixo de um limiar simples (ex. < 0.7), não destaque campo-a-campo.

## Escopo

- `/obras/[obraId]/despesas/[despesaId]/confirmar`: busca a `despesa` + `recibo` associado; pede URL assinada de leitura em `/api/storage/sign` (`{kind: "recibo", id: recibo.id, action: "read"}`) pra exibir a foto.
- Campos pré-preenchidos de `dados_extraidos` quando existir (fornecedor por nome — precisa resolver/criar contra `fornecedores`, ou deixar livre pra usuário escolher no select; se `dados_extraidos` for null porque `status_processamento = falhou`, formulário abre vazio); usuário completa categoria, etapa vinculada, forma de pagamento (nenhum desses vem da extração).
- Itens de `dados_extraidos.itens` viram linhas editáveis de `despesa_itens` (usuário pode editar/remover/adicionar antes de confirmar).
- Ao confirmar: `update despesas` com os campos finais, `status = confirmada`, `confirmado_em = now()`; grava/atualiza `despesa_itens`.
- Se `status_processamento = falhou` ou `aguardando_upload` ainda (edge case: usuário abriu antes do upload confirmar), tratar como formulário manual normal — foto pode não estar disponível ainda, não travar a tela por isso.

## Comments
