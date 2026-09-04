# Polish — separar formulário de criação da listagem

Status: done

Feedback direto do usuário em 2026-09-04: "Separe os cadastros das listagens". A maioria das telas do app misturava lista + formulário de criação na mesma página (só `despesas` já seguia o padrão certo desde o início — "nova despesa" sempre foi uma rota própria).

## Mudanças

Extraído o formulário de criação de cada uma dessas telas pra uma rota própria (`/nova`, `/novo` ou `/importar`), deixando a listagem só com a lista + um botão de entrada:

- `/obras` → `/obras/nova`
- `/cadastros` (categorias e fornecedores) → `/cadastros/categorias/nova` e `/cadastros/fornecedores/nova`
- `/equipe` → `/equipe/novo`
- `/obras/[obraId]/equipe` → `/obras/[obraId]/equipe/novo`
- `/obras/[obraId]/etapas` → `/obras/[obraId]/etapas/nova`
- `/obras/[obraId]/etapas/[etapaId]/medicoes` → `.../medicoes/nova`
- `/obras/[obraId]/recebimentos` → `/obras/[obraId]/recebimentos/novo`
- `/obras/[obraId]/conciliacao` (formulário de importar CSV) → `/obras/[obraId]/conciliacao/importar`

## Fora de escopo (de propósito)

- Ações de **editar linha existente** (trocar papel de membro, vincular transação da conciliação) continuam inline na própria lista — não é o mesmo padrão de "criar novo" que estava poluindo a tela, é edição pontual de um item já visível.
- `despesas`, `diario` e `etapas/[etapaId]/editar` já seguiam o padrão certo, não precisaram de mudança.

## Issues

01. Extrair formulário de criação em 8 telas pra rota própria

## Comments

- Testado de ponta a ponta contra o hospedado: conferido visualmente que nenhuma listagem mostra mais o formulário embutido e que toda página `/nova`/`/novo`/`/importar` renderiza certo; POST real do form (wire protocol) testado em 3 casos representativos dos diferentes formatos de ação (`criarObra` sem argumento vinculado, `criarEtapa` com `obraId` vinculado, `convidarMembro` via RPC) — todos os três gravaram certo no banco e redirecionaram pro lugar certo. Dado de teste apagado ao final.
