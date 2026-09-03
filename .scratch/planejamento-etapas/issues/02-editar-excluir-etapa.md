# Editar e excluir etapa

Status: done
Blocked by: 01

## Contexto

`despesas-recibo`/01 criou um cadastro mínimo de etapas (criar+listar, só nome/valor/datas) só pra desbloquear os selects da despesa. Mockup `docs/stitch/stitch_obra_certa/{planejamento_de_etapas,planejamento_desktop}`.

## Escopo

- Estende `/obras/[obraId]/etapas`: form de criação ganha `peso_percentual` (%) e `ordem` (número), além dos campos que já existiam.
- Cada etapa da lista ganha um link "Editar" pra `/obras/[obraId]/etapas/[etapaId]/editar` (form pré-preenchido, todos os campos) e um botão de excluir (com confirmação simples do browser — `confirm()` ou equivalente, sem modal customizado).
- Sem recálculo automático de peso das outras etapas ao editar uma (fora de escopo, `spec.md`).
- Lista volta a ordenar por `ordem` (quando preenchido) em vez de `data_inicio_prevista` (comportamento atual do ticket mínimo).

## Comments

- `/obras/[obraId]/etapas`: form de criação ganhou `descricao`/`peso_percentual`/`ordem`; lista ordena por `ordem` (nulls last) e depois `data_inicio_prevista`. Cada etapa ganhou link de editar (`/[etapaId]/editar`, form pré-preenchido com todos os campos) e um botão de excluir (`ExcluirEtapaForm`, Client Component só pra poder chamar `confirm()` antes de submeter — o resto do form continua um Server Action puro).
- **Testado de ponta a ponta de verdade contra o hospedado**, incluindo o POST real (wire protocol do Server Action, mesma técnica dos efforts anteriores) das três ações: criei uma etapa de teste com todos os campos novos, editei via POST real (nome/descrição/valor/peso/ordem mudaram certo), excluí via POST real (sumiu do banco) — tudo reproduzindo o form de verdade, não só chamada direta ao banco. Etapa "Fundação" (real, do cadastro do effort anterior) ganhou peso 15% e ordem 1 como efeito colateral do teste de `update` — mantido, é dado real válido.
