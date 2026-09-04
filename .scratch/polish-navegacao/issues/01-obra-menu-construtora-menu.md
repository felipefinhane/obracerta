# ObraMenu + ConstrutoraMenu + simplificação da lista de obras

Status: done

## Escopo

- `src/app/(app)/obras/[obraId]/ObraMenu.tsx`: dropdown com as 8 seções da obra, destaca a atual.
- `src/app/(app)/ConstrutoraMenu.tsx`: dropdown "Construtora" (Cadastros, Equipe) no `AppHeader`.
- `/obras`: card de obra vira um único link "Abrir obra".

## Comments

- Testado de ponta a ponta contra o hospedado (sessão real): verificado que o botão do `ObraMenu` mostra a seção correta em duas rotas diferentes, que `/obras` não expõe mais Cadastros/Equipe fora do menu Construtora, e que os dois cards de obra de demonstração mostram "Abrir obra".
