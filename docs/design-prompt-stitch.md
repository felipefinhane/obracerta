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
É UM webapp responsivo só (Next.js/PWA) — não é um app nativo separado do
site, é a mesma aplicação rodando no navegador do celular e no desktop.
Por isso, para CADA tela abaixo eu marquei explicitamente se quero o
mockup em mobile (390px de largura), desktop (1280px), ou os dois — não
deixe implícito "adapta depois", gere os dois quando eu pedir os dois. A
escolha de qual(is) pedir por tela segue o uso real já descrito em
`planejamento.md` §3: captura acontece na rua, sempre no celular; a
confirmação e a gestão acontecem "quando o usuário tiver tempo, celular ou
desktop" — por isso a maioria das telas pede os dois tamanhos, e só as
duas telas de captura em campo (8 e 14) são mobile-only de propósito.

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

1. Login — [mobile + desktop] email + senha, campo de erro visível, link
   "criar conta".

2. Cadastro — [mobile + desktop] email + senha, sem confirmação de email
   (login funciona na hora).

3. Onboarding (só na primeira vez) — [mobile + desktop] "Crie sua
   construtora": nome da construtora, CNPJ (opcional). Tela única, sem
   fricção.

4. Lista de Obras — [mobile + desktop, layouts podem diferir bastante:
   lista/cards empilhados no mobile, grid ou tabela no desktop] cards com
   nome da obra, cliente, endereço, e um indicador rápido de progresso
   (ex. barra pequena de % orçado x realizado). Botão destacado "Nova
   obra". Se o usuário tiver só uma obra, o app pula direto pra ela depois
   do login (mostrar como o app se comportaria, mas a tela de lista existe
   pra quem tem mais de uma).

5. Nova Obra — [mobile + desktop] formulário: nome, endereço, nome do
   cliente, valor total planejado, data de início prevista, data de fim
   prevista.

6. Detalhe da Obra (hub) — [mobile + desktop] topo com resumo (nome,
   cliente, % orçado x realizado consolidado), abaixo navegação por seção:
   Planejamento, Despesas, Diário, Relatórios.

7. Planejamento — Etapas — [mobile + desktop, mas o desktop é o uso mais
   comum — montar o orçamento por etapa é trabalho de mesa, não de campo]
   lista de etapas da obra (nome, % de peso sobre o total, valor
   planejado, datas previstas, e um indicador de % medido/concluído).
   Botão "Nova etapa". Sem fluxo de aprovação — é medição simples.

8. Captura de Recibo — [MOBILE APENAS, de propósito — não faz sentido em
   desktop, é literalmente "tirar foto no meio da compra"; o fluxo mais
   crítico de desenhar bem] tela minimalista: botão grande "Tirar foto" ou
   "Escolher da galeria". Único campo que pode aparecer é escolher a obra
   (só se o usuário tiver mais de uma — se só tiver uma, nem pergunta, já
   manda direto). Depois de tirar a foto: confirmação rápida "Recibo
   registrado! Você confirma os detalhes depois." — a pessoa NÃO deve
   preencher nada mais nesse momento. Precisa ser operável com uma mão, em
   segundos, no meio de uma compra.

9. Recibos Pendentes de Confirmação — [mobile + desktop — `planejamento.md`
   §3 é explícito: a confirmação acontece "quando o usuário tiver tempo,
   celular ou desktop"] lista dos lançamentos provisórios acumulados
   (miniatura da foto + o que já foi extraído automaticamente, tipo
   fornecedor e valor, quando disponível + indicador de "processando" pros
   que ainda não terminaram a extração).

10. Confirmar Despesa — [mobile + desktop, mesmo motivo da tela 9 — pode
    ser a tela mais usada em desktop do produto, já que a pessoa "tem
    calma" nesse momento] a foto do recibo ao lado (desktop) ou acima
    (mobile) dos campos extraídos e editáveis: fornecedor, data, valor,
    itens (com quantidade/valor unitário/total), categoria, etapa
    vinculada, forma de pagamento. Campos que vieram com baixa confiança
    da extração devem ter destaque visual (ex. borda amarela) pedindo
    atenção extra. Botão "Confirmar despesa".

11. Nova Despesa Manual — [mobile + desktop] mesmos campos da confirmação,
    mas em branco (sem foto), pra quando o gasto não tem recibo pra
    fotografar.

12. Extrato de Despesas — [mobile + desktop, mas o desktop é o uso mais
    comum — é tela de análise/filtro] lista filtrável por categoria,
    fornecedor e período, com total.

13. Diário de Obra — [mobile + desktop] feed cronológico de lançamentos,
    cada um com foto, data, clima, efetivo presente, ocorrências, etapa
    vinculada (se houver). Botão "Novo lançamento".

14. Novo Lançamento de Diário — [MOBILE APENAS, de propósito — é captura
    em campo, igual à tela 8] foto, texto livre, seletor de clima (ícone
    simples: sol/nublado/chuva), número de pessoas presentes, ocorrências
    (texto livre), etapa vinculada (opcional).

15. Relatório Orçado x Realizado — [mobile + desktop, mas o desktop é o
    uso mais comum] por etapa (lista/barra comparando planejado x gasto) e
    um total consolidado da obra. É o relatório mais importante do
    produto — deve comunicar "estourou" ou "dentro do esperado" à primeira
    vista (cor/ícone), sem precisar ler número.

NÃO DESENHAR (fora do escopo do MVP, não faz sentido gerar tela pra isso)
Conciliação bancária, contratos com fornecedor, aprovação formal de
medição, relatório de medição pro banco, vídeo no diário de obra (só
foto), alertas/notificações, almoxarifado, qualquer fluxo de pré-venda ou
proposta comercial.

PRIORIDADE SE PRECISAR ESCOLHER POR ONDE COMEÇAR
Se for gerar aos poucos: comece pela tela 8 (Captura de Recibo, mobile) e
10 (Confirmar Despesa, mobile e desktop) — são as mais específicas do
produto e as que mais precisam acertar a experiência. Login/Cadastro/Lista
de Obras podem ser mais genéricas. Ao pedir uma tela por vez, sempre repita
explicitamente qual tamanho quer (mobile, desktop, ou os dois) — não deixe
o Stitch assumir.
```
