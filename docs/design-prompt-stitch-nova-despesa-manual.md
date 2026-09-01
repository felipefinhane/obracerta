# Prompt de design — Google Stitch (parte 3: Nova Despesa Manual)

> Terceira solicitação ao [Stitch](https://stitch.withgoogle.com). Das 15 telas do prompt original (`docs/design-prompt-stitch.md`), só "Nova Despesa Manual" não saiu — nem na leva mobile, nem na leva desktop (`docs/design-prompt-stitch-desktop.md`). Este prompt pede só essa tela, nas duas versões, e aproveita pra corrigir um deslize de vocabulário que apareceu numa tela anterior.
>
> Cole na mesma conversa do Stitch, pra reaproveitar o design system já gerado (`docs/stitch/stitch_obra_certa/obracerta_design_system/DESIGN.md`).

```
Continuação do ObraCerta. Reparei que uma tela do pedido original ficou de
fora nas duas levas (mobile e desktop): "Nova Despesa Manual". Preciso dela
agora, nos dois tamanhos — mobile (390px) e desktop (1280px) — usando o
mesmo design system que você já definiu (cores, tipografia, componentes).

NOVA DESPESA MANUAL
É a mesma tela de "Confirmar Despesa" que você já desenhou, mas SEM foto de
recibo ao lado — é pra quando o gasto não tem nota/recibo pra fotografar
(ex.: pagamento combinado informalmente, taxa, mão de obra avulsa). Os
campos começam todos em branco, não pré-preenchidos por extração:

- Fornecedor (texto livre)
- Data da despesa
- Valor total
- Forma de pagamento
- Categoria (mesmo seletor da tela de Confirmar Despesa)
- Etapa vinculada (mesmo seletor — "Vincular à Etapa")
- Itens discriminados (mesma tabela editável: descrição, quantidade, valor
  unitário, total) — mas aqui começa vazia, com um jeito de adicionar linha
  (ex. botão "+ Adicionar item")
- Botão principal: "Salvar Despesa" (não "Confirmar Despesa", já que não
  há nada vindo de extração pra confirmar)

Como não tem painel de foto, o formulário pode ocupar mais largura em
desktop (uma coluna só, mais centralizada, em vez do layout de duas
colunas lado a lado que a tela de Confirmar Despesa usa) — não precisa
forçar o mesmo layout de duas colunas se não fizer sentido sem a foto.

CORREÇÃO DE VOCABULÁRIO (aplicar nesta tela e reconferir nas outras)
Numa tela anterior (Confirmar Despesa, desktop) o menu lateral usou "+ Novo
Projeto" — o termo correto do produto é "+ Nova Obra". "Projeto" não é
vocabulário do ObraCerta; a entidade sempre se chama Obra. Use "Obra"/"Nova
Obra" em todo lugar que fizer referência a isso, incluindo nesta tela nova.
```
