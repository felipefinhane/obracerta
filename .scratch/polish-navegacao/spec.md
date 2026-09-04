# Polish — navegação (menu de obra e separação Construtora/Obras)

Status: done

Feedback direto do usuário em 2026-09-04, depois do effort `recebimentos-conciliacao` ter levado a `ObraSubNav` de 4 pra 8 seções:

> "Navegação está um pouco ruim na questao de UX pois, acho que deveria ter um menu após selecionar a obra e poder navegar nas opções relacionadas a ela, ao entrar no sistema já aparece as obras e um cadastro, acredito que isso deveria ser separado."

Dois problemas concretos:
1. A "sub-nav" de obra (`ObraSubNav`) era uma faixa de 8 abas horizontais com scroll — não lia como um menu de navegação, principalmente no celular.
2. `/obras` (entrada do sistema) tinha "Cadastros" e "Equipe" (construtora, não obra) soltos no header, no mesmo nível visual da lista de obras.

## Mudanças

- `ObraMenu` (novo, Client Component): dropdown de verdade — botão mostra a seção atual (via `usePathname`), clique expande a lista das 8 seções. Substitui a faixa de abas em `ObraSubNav`.
- `ConstrutoraMenu` (novo, Client Component): agrupa Cadastros + Equipe num dropdown "Construtora" no `AppHeader`, separado visualmente de Obras.
- `/obras`: cada card de obra simplificado pra um único link "Abrir obra" (entra direto em Despesas) — os 4 links soltos que existiam viram redundantes agora que o `ObraMenu` cobre a navegação inteira depois de entrar.

## Fora de escopo

- Dashboard/página inicial própria de uma obra (`/obras/[obraId]`) — "Abrir obra" aponta direto pra Despesas por simplicidade; se precisar de uma visão geral consolidada da obra, é ticket próprio.
- Reorganizar o menu por categoria (ex: agrupar Recebimentos/Fluxo de Caixa/Conciliação sob um "Financeiro") — 8 itens numa lista só ainda é navegável; reavaliar se crescer mais.

## Issues

01. ObraMenu + ConstrutoraMenu + simplificação da lista de obras

## Comments

- 1/1 ticket. Sem mudança de schema/RLS — só componentes de navegação. Testado renderizando de verdade contra o hospedado: botão do menu mostra a seção certa em rotas diferentes (Despesas, Fluxo de Caixa), `/obras` não mostra mais Cadastros/Equipe soltos (só o menu "Construtora" colapsado), cards de obra mostram só "Abrir obra".
