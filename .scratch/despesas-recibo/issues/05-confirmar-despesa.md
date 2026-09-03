# Confirmar despesa

Status: done
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

- Extraí a lógica de autorização de `/api/storage/sign` pra `src/lib/storage/signed-url.ts` (reusada tanto pelo Route Handler quanto direto por este Server Component, sem round-trip HTTP interno) — comportamento idêntico, só reorganização.
- `/obras/[obraId]/despesas/[despesaId]/confirmar`: foto via URL assinada de leitura, campos pré-preenchidos de `dados_extraidos` (fornecedor mostrado como texto — "escolha o cadastro correspondente" — em vez de tentar casar/criar fornecedor automaticamente contra o nome extraído, que é abertamente impreciso pra fazer sem alguma forma de matching; fica simples de propósito), itens extraídos como linhas editáveis + linhas em branco extras. Banner de "revisão sugerida" quando `confianca_extracao < 0.7` (confiança é do recibo inteiro, não por campo — ver nota no ticket). Confirmar faz `update` em `despesas` (`status confirmada`) + `insert` em `despesa_itens`.
- **Testado de ponta a ponta de verdade**, reaproveitando o mesmo recibo que processou com sucesso no ticket 03 (fornecedor "DEPOSITO SANTA IFIGENIA", item "TIGRE JOELHO ESGOTO 75X90", confiança 0.95): a página renderizou a foto (URL assinada real) e os campos pré-preenchidos batendo exatamente com `dados_extraidos`; sem banner de confiança baixa (0.95 ≥ 0.7, correto). Repeti a técnica do ticket 02 (capturar os hidden fields `$ACTION_*` do form real e reenviar o mesmo POST multipart) pra confirmar de verdade — recebi `303` pro `/pendentes` e conferi via REST que `despesas.status` virou `confirmada` com todos os campos certos e `despesa_itens` ganhou a linha com `valor_total` calculado (8 × 9,35 = 74,80).
