# Polish — editar/excluir despesa e gerenciar equipe

Status: done

Segundo pacote de polish pós-MVP (item 1 da lista de próximos passos de 2026-09-04): edição/exclusão de despesa já confirmada, e edição de papel/remoção de membro da equipe — os dois gaps deliberadamente deixados de fora dos efforts anteriores (`despesas-recibo`, `convite-equipe`).

## Escopo

- Editar despesa confirmada (fornecedor, categoria, etapa, valor, data, forma de pagamento, descrição) e excluir despesa.
- Editar papel de um membro da construtora, remover membro (construtora e obra).

## Fora de escopo

- Editar itens (`despesa_itens`) de uma despesa já confirmada — fica só os campos principais, mesmo nível de simplicidade do resto do MVP.
- Impedir o próprio admin de se auto-remover ou remover o último admin (checagem de segurança de conta) — anotado como gap conhecido, sem volume de uso real que justifique agora; tratar com cuidado na UI (não esconder o botão, mas também não é hoje uma trava no banco).
- Resiliência offline/PWA — item de polish maior, distinto deste pacote, fica pra quando entrar em pauta específica.
- Visibilidade de erro nos casos secundários que já eram fora de escopo em `polish-erros` (ex: `despesa_itens` falhar depois que a despesa em si já foi salva) — não mudou aqui.

## Issues

01. RLS: delete em despesas, update/delete em construtora_membros/obra_membros
02. Editar e excluir despesa confirmada
03. Editar papel e remover membro (equipe da construtora e da obra)

Ordem: 01 bloqueia 02 e 03. 02 e 03 são independentes entre si.

## Comments

- 3/3 tickets fechados, testados de ponta a ponta contra o hospedado (POST real dos forms) — edição/exclusão de despesa confirmada, edição de papel e remoção de membro nos dois níveis (construtora e obra).
- Deploy: ainda não commitado/enviado ao Vercel nesta sessão — combinado com o resto do pedido (item 2, Recebimentos/conciliação) antes de subir tudo junto.
