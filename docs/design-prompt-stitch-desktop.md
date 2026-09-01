# Prompt de design — Google Stitch (parte 2: versões desktop)

> Segunda solicitação ao [Stitch](https://stitch.withgoogle.com), depois da primeira leva de telas (mobile) já enviada com `docs/design-prompt-stitch.md`. Esse arquivo não foi alterado — este aqui é um prompt novo, complementar, só com o que muda pra pedir a versão desktop das mesmas telas.
>
> Cole isso na continuação da mesma conversa com o Stitch (assim ele mantém o estilo visual já gerado). Se for uma sessão nova, cole também o prompt original antes deste, pra ele ter o contexto completo do produto.

```
Isso é uma continuação do pedido anterior do ObraCerta (app de controle de
obras, PT-BR). Já gerei as telas em mobile — agora preciso da MESMA
aplicação, mesmas telas, mesmo vocabulário e mesmo estilo visual, só que em
layout DESKTOP (1280px de largura como referência).

Não é um produto diferente nem uma seção nova — é a versão desktop das
telas que você já desenhou, porque ObraCerta é um webapp responsivo só (não
um app nativo separado do site): a mesma pessoa usa a versão mobile na rua/
canteiro de obra e a versão desktop na mesa, gerenciando e analisando com
calma.

Mantenha: mesma paleta de cor, mesma tipografia, mesmo tom visual (direto,
confiável, sem enfeite) e o mesmo vocabulário exato de antes — Obra,
Construtora, Etapa, Despesa, Lançamento provisório, Recibo, Diário de obra,
Orçado vs. Realizado.

TELAS PRA REFAZER EM DESKTOP (todas, exceto as duas marcadas como
mobile-only abaixo):

1. Login
2. Cadastro
3. Onboarding — "Crie sua construtora"
4. Lista de Obras — em desktop, considere grid ou tabela em vez de cards
   empilhados (o mobile foi lista/cards; desktop tem espaço pra mostrar
   mais informação por obra de uma vez — nome, cliente, endereço, %
   orçado x realizado, tudo visível sem precisar abrir).
5. Nova Obra — formulário
6. Detalhe da Obra (hub) — resumo no topo + navegação por seção
   (Planejamento, Despesas, Diário, Relatórios). Em desktop, considere um
   menu lateral fixo em vez de abas, já que tem espaço horizontal sobrando.
7. Planejamento — Etapas — ESSA É A TELA MAIS IMPORTANTE PRA ACERTAR EM
   DESKTOP: montar o orçamento por etapa é trabalho de mesa, não de
   campo — é aqui que a pessoa vai passar mais tempo, então pode (e deve)
   ter mais densidade de informação por tela do que a versão mobile teria.
9. Recibos Pendentes de Confirmação — lista de lançamentos provisórios
10. Confirmar Despesa — ESSA TAMBÉM É CRÍTICA EM DESKTOP: a foto do recibo
    ao lado dos campos extraídos e editáveis (lado a lado agora que tem
    espaço horizontal, não empilhado como no mobile). É provavelmente a
    tela mais usada em desktop do produto inteiro.
11. Nova Despesa Manual
12. Extrato de Despesas — ESSA TAMBÉM É PRINCIPALMENTE DESKTOP: é tela de
    análise/filtro (por categoria, fornecedor, período) — aproveite o
    espaço horizontal pra mostrar filtros e resultado lado a lado, ou uma
    tabela mais rica do que caberia no mobile.
13. Diário de Obra — feed cronológico de lançamentos
15. Relatório Orçado x Realizado — ESSA TAMBÉM É PRINCIPALMENTE DESKTOP: é
    onde a pessoa analisa números com calma — pode ter gráfico mais
    elaborado (barras comparando planejado x gasto por etapa, lado a lado)
    do que a versão mobile.

NÃO PRECISA DE VERSÃO DESKTOP (ficam mobile-only, de propósito — são
captura em campo, não fazem sentido numa mesa):
- Captura de Recibo (tirar foto)
- Novo Lançamento de Diário (foto + clima + efetivo + ocorrências)

Se ficar em dúvida sobre algum campo/copy de alguma tela, usa o que você já
gerou na versão mobile como referência — os dados e o texto são os mesmos,
só o layout que muda pra aproveitar a tela maior.
```
