# Prompt de design — Google Stitch (parte 4: correção sistemática de vocabulário)

> Quarta solicitação. Na parte 3 eu já tinha pedido pra trocar "Projeto" por "Obra" — a correção só colou na tela específica que eu apontei (`confirmar_despesa_desktop`) e não generalizou: a tela nova (`nova_despesa_manual_desktop`) já nasceu com o mesmo erro, e um `grep` em todas as telas achou mais ocorrências que eu não tinha visto na primeira revisão. Este prompt lista cada ocorrência exata, pra não depender do Stitch "lembrar" a regra sozinho de novo.
>
> Cole na mesma conversa do Stitch.

```
Correção de vocabulário que preciso que valha pra TODAS as telas do
ObraCerta, não só pra uma — da última vez a correção só aplicou na tela
que eu tinha apontado, e uma tela nova já nasceu com o mesmo erro de novo.

REGRA: a entidade do produto é sempre "Obra". Nunca "Projeto". Isso vale
pra qualquer lugar do texto — títulos, botões, labels, opções de dropdown,
texto de apoio/legenda, tudo. "Projeto" não existe no vocabulário do
ObraCerta.

Ocorrências confirmadas que precisam corrigir agora (pode ter mais que eu
não achei manualmente — ao revisar, procure "projeto" em TODAS as telas
já geradas, não só nestas):

1. Tela "Lista de Obras" (mobile): "Gerencie e acompanhe o progresso dos
   seus projetos." -> trocar "projetos" por "obras".
2. Tela "Lista de Obras" (mobile), estado vazio: "Comece cadastrando seu
   primeiro projeto para acompanhar custos e evolução." -> trocar
   "projeto" por "obra" ("...cadastrando sua primeira obra...").
3. Tela "Diário de Obra" (mobile): subtítulo "Projeto: Residencial Alpha"
   -> "Obra: Residencial Alpha".
4. Tela "Planejamento de Etapas" (desktop): subtítulo "Projeto: Residencial
   Alpha - Torre B" -> "Obra: Residencial Alpha - Torre B".
5. Tela "Relatório Orçado x Realizado" (desktop): opção de dropdown
   "Projeto Alpha (Centro)" -> "Obra Alpha (Centro)" (ou só o nome da obra,
   sem prefixo, se ficar mais limpo — sua escolha, contanto que não use a
   palavra "Projeto").
6. Tela "Nova Despesa Manual" (desktop): botão do menu lateral "+ Novo
   Projeto" -> "+ Nova Obra" (mesmo texto que já corrigi antes em
   Confirmar Despesa — parece que o componente de menu lateral tem duas
   versões divergentes; se for esse o caso, unifique os dois pra usar o
   mesmo componente/texto).

Depois de corrigir essas seis, faça uma revisão geral em todas as telas já
geradas (mobile e desktop) procurando qualquer outra menção a "projeto"
que eu não tenha listado, e corrija também.
```
