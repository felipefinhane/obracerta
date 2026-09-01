# Tela de Obras — listagem + criação

Status: open
Blocked by: 01, 05

## Contexto

Ver `docs/mvp.md` seção 1 ("Obras") e `docs/modelo-dados.md` pro schema exato.

## Escopo

- Listagem das obras que o usuário tem acesso (a própria RLS de `select` já filtra — nenhuma lógica extra de autorização no client).
- Formulário de criação: nome, endereço, cliente, datas previstas, valor total planejado (campos de `docs/mvp.md`).
- Sem edição/exclusão nesta ticket.
- Testar: admin vê e cria obras da construtora dele; um segundo usuário sem vínculo não vê nada.

## Comments
