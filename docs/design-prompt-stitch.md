# Prompt de design — Google Stitch

> Prompt pronto pra colar no [Stitch](https://stitch.withgoogle.com) e gerar as telas do MVP. Escopo, telas e vocabulário vêm de `docs/mvp.md`, `docs/planejamento.md` e `CONTEXT.md` — não é uma decisão nova, é um resumo pra outra ferramenta.
>
> **Tom visual e paleta de cor são sugestão minha, não decisão do projeto** — ninguém grillou isso ainda. Ajuste à vontade antes de usar.

```
Produto: ObraCerta — app web (PT-BR) de controle de obras para construtoras
pequenas/médias no Brasil (construção residencial e pequenas reformas).

CICLO CENTRAL DO PRODUTO
Planejar a obra em etapas → registrar despesas reais (com captura de recibo
pelo celular) → comparar orçado x realizado → acompanhar o andamento em
diário de obra com fotos. O motivador de negócio: o dono da obra precisa
comprovar ao banco financiador o uso dos recursos por etapa pra destravar
parcelas — por isso "orçado vs. realizado por etapa" é o conceito central,
não um extra.

PÚBLICO E PAPÉIS (afeta o que cada tela mostra)
- Admin: dono da conta/construtora, gerencia tudo.
- Engenheiro/mestre de obra: lança etapas, despesas, diário.
- Financeiro: lança despesas, acompanha orçado x realizado.
- Cliente (dono do imóvel): só leitura — acompanha sem editar nada.
Não é público tech-savvy — pense em mestre de obra usando celular no
canteiro, não em early adopter de app.

PLATAFORMA
Mobile-first. A captura de recibo e o lançamento de diário acontecem no
celular, na rua ou no canteiro de obra, muitas vezes com uma mão só e sol
forte na tela (alto contraste importa). As telas de relatório/gestão também
precisam funcionar bem em desktop. Desenhe primeiro pensando em mobile
(390px de largura como referência) e depois pense em como adapta pra
desktop nas telas de gestão/relatório.

TOM VISUAL (sugestão minha, não é uma decisão fechada do projeto — ajuste
à vontade)
Direto, confiável, sem enfeite. Paleta sóbria/profissional (cinzas,
branco, um azul ou verde-escuro neutro como cor primária); um único acento
de cor mais vivo (ex. laranja) só pra ações principais e alertas de
atenção — sem remeter a "cone de obra" caricato. Tipografia com boa
legibilidade em telas pequenas sob luz forte.

VOCABULÁRIO — use esses termos exatos nas telas, não troque por sinônimo:
- Obra (não "projeto" nem "canteiro")
- Construtora (o tenant/empresa)
- Etapa (não "fase" nem "milestone")
- Despesa (um gasto real; não chame de "lançamento" fora do estado
  provisório abaixo)
- Lançamento provisório = uma Despesa recém-capturada por foto, ainda não
  confirmada
- Recibo (a captura fotográfica + extração)
- Diário de obra (não "relatório diário" nem "log")
- Orçado vs. Realizado (grafia exata, é o relatório central)

TELAS A DESENHAR

1. Login — email + senha, campo de erro visível, link "criar conta".

2. Cadastro — email + senha, sem confirmação de email (login funciona na
   hora).

3. Onboarding (só na primeira vez) — "Crie sua construtora": nome da
   construtora, CNPJ (opcional). Tela única, sem fricção.

4. Lista de Obras — cards com nome da obra, cliente, endereço, e um
   indicador rápido de progresso (ex. barra pequena de % orçado x
   realizado). Botão destacado "Nova obra". Se o usuário tiver só uma
   obra, o app pula direto pra ela depois do login (mostrar como o app se
   comportaria, mas a tela de lista existe pra quem tem mais de uma).

5. Nova Obra — formulário: nome, endereço, nome do cliente, valor total
   planejado, data de início prevista, data de fim prevista.

6. Detalhe da Obra (hub) — topo com resumo (nome, cliente, % orçado x
   realizado consolidado), abaixo navegação por seção: Planejamento,
   Despesas, Diário, Relatórios.

7. Planejamento — Etapas — lista de etapas da obra (nome, % de peso sobre
   o total, valor planejado, datas previstas, e um indicador de % medido/
   concluído). Botão "Nova etapa". Sem fluxo de aprovação — é medição
   simples.

8. Captura de Recibo (mobile, o fluxo mais crítico de desenhar bem) —
   tela minimalista: botão grande "Tirar foto" ou "Escolher da galeria".
   Único campo que pode aparecer é escolher a obra (só se o usuário tiver
   mais de uma — se só tiver uma, nem pergunta, já manda direto). Depois
   de tirar a foto: confirmação rápida "Recibo registrado! Você confirma
   os detalhes depois." — a pessoa NÃO deve preencher nada mais nesse
   momento. Precisa ser operável com uma mão, em segundos, no meio de uma
   compra.

9. Recibos Pendentes de Confirmação — lista dos lançamentos provisórios
   acumulados (miniatura da foto + o que já foi extraído automaticamente,
   tipo fornecedor e valor, quando disponível + indicador de "processando"
   pros que ainda não terminaram a extração).

10. Confirmar Despesa — a foto do recibo ao lado (ou acima, em mobile) dos
    campos extraídos e editáveis: fornecedor, data, valor, itens (com
    quantidade/valor unitário/total), categoria, etapa vinculada, forma de
    pagamento. Campos que vieram com baixa confiança da extração devem ter
    destaque visual (ex. borda amarela) pedindo atenção extra. Botão
    "Confirmar despesa".

11. Nova Despesa Manual — mesmos campos da confirmação, mas em branco
    (sem foto), pra quando o gasto não tem recibo pra fotografar.

12. Extrato de Despesas — lista filtrável por categoria, fornecedor e
    período, com total.

13. Diário de Obra — feed cronológico de lançamentos, cada um com foto,
    data, clima, efetivo presente, ocorrências, etapa vinculada (se houver).
    Botão "Novo lançamento".

14. Novo Lançamento de Diário — foto, texto livre, seletor de clima
    (ícone simples: sol/nublado/chuva), número de pessoas presentes,
    ocorrências (texto livre), etapa vinculada (opcional).

15. Relatório Orçado x Realizado — por etapa (lista/barra comparando
    planejado x gasto) e um total consolidado da obra. É o relatório mais
    importante do produto — deve comunicar "estourou" ou "dentro do
    esperado" à primeira vista (cor/ícone), sem precisar ler número.

NÃO DESENHAR (fora do escopo do MVP, não faz sentido gerar tela pra isso)
Conciliação bancária, contratos com fornecedor, aprovação formal de
medição, relatório de medição pro banco, vídeo no diário de obra (só
foto), alertas/notificações, almoxarifado, qualquer fluxo de pré-venda ou
proposta comercial.

PRIORIDADE SE PRECISAR ESCOLHER POR ONDE COMEÇAR
Se for gerar aos poucos: comece pela tela 8 (Captura de Recibo) e 10
(Confirmar Despesa) — são as mais específicas do produto e as que mais
precisam acertar a experiência. Login/Cadastro/Lista de Obras podem ser
mais genéricas.
```
