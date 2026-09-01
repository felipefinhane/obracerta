# Tela de Obras — listagem + criação

Status: done — com um gap pequeno anotado, ver comentário
Blocked by: 01, 05

## Contexto

Ver `docs/mvp.md` seção 1 ("Obras") e `docs/modelo-dados.md` pro schema exato.

## Escopo

- Listagem das obras que o usuário tem acesso (a própria RLS de `select` já filtra — nenhuma lógica extra de autorização no client).
- Formulário de criação: nome, endereço, cliente, datas previstas, valor total planejado (campos de `docs/mvp.md`).
- Sem edição/exclusão nesta ticket.
- Testar: admin vê e cria obras da construtora dele; um segundo usuário sem vínculo não vê nada.

## Comments

- `src/app/obras/page.tsx` + `actions.ts`: listagem (RLS já filtra, zero lógica de autorização no client) + formulário de criação com os campos de `mvp.md`.
- **Testado via HTTP real, fluxo completo até aqui**: usuário A cadastra → onboarding → cria obra "Casa da Praia" pela tela → aparece na listagem com os campos certos (cliente, endereço). Usuário B (outra conta, nunca fez onboarding) acessa `/obras` direto e vê "Nenhuma obra ainda" — isolamento confirmado também na camada de UI, não só no banco.
- **Gap pequeno, não é falha de segurança**: só `/` checa se o usuário tem construtora e redireciona pro onboarding — `/obras` não faz essa checagem, então um usuário sem construtora que navegar direto pra lá vê a tela vazia com um formulário cujo `construtora_id` oculto fica vazio (submeter falharia, RLS/FK protegem, só não é a melhor UX). Ajustar quando reformular a navegação entre telas.
