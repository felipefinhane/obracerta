# Export do Stitch

Telas geradas pelo [Stitch](https://stitch.withgoogle.com) a partir de `docs/design-prompt-stitch.md` (mobile) e `docs/design-prompt-stitch-desktop.md` (desktop). Cada pasta em `stitch_obra_certa/` é uma tela: `code.html` (markup/estilo gerado) + `screen.png` (screenshot renderizado). `obracerta_design_system/DESIGN.md` tem os tokens (cor, tipografia, espaçamento) que o Stitch definiu.

O `.zip` original fica só local (`.gitignore`) — o que está versionado é o conteúdo já extraído.

## Cobertura

15 telas pedidas no prompt original, todas presentes agora (depois da 3ª solicitação, `docs/design-prompt-stitch-nova-despesa-manual.md`):
- **15 telas mobile**
- **13 telas desktop**

## Gaps conhecidos

- ~~"Nova Despesa Manual" ausente~~ — **resolvido**, veio na atualização do zip (`nova_despesa_manual/` e `nova_despesa_manual_desktop/`).
- **Vocabulário "Projeto" vazando como sinônimo de "Obra" — pior do que o achado inicial, aparece espalhado**. A correção pedida na 3ª solicitação só "colou" na tela específica que eu tinha apontado (`confirmar_despesa_desktop`) — não generalizou, e a tela nova já nasceu com o mesmo erro. Ocorrências confirmadas via `grep -rli "projeto" */code.html`:
  - `lista_de_obras/code.html:182` — "acompanhe o progresso dos seus **projetos**"
  - `lista_de_obras/code.html:272` — "cadastrando seu primeiro **projeto**"
  - `di_rio_de_obra/code.html:188` — "**Projeto**: Residencial Alpha" (deveria ser "Obra: ...")
  - `planejamento_desktop/code.html:172` — "**Projeto**: Residencial Alpha - Torre B"
  - `relat_rio_or_ado_x_realizado_desktop/code.html:170` — "**Projeto** Alpha (Centro)" (opção de dropdown)
  - `nova_despesa_manual_desktop/code.html:148` — "Novo **Projeto**" (mesmo erro que já tinha sido apontado, voltou)
  - Ver `docs/design-prompt-stitch-fix-vocabulario.md` — 4ª solicitação, pede correção sistemática em vez de pontual.

## Qualidade observada

A paleta e o tom que saíram (azul-marinho + laranja de segurança, alto contraste, pensado pra sol forte no canteiro) batem com a sugestão de tom visual do prompt original — o Stitch entendeu bem o contexto. `confirmar_despesa_desktop` em particular acertou o pedido específico do prompt: foto ao lado dos campos extraídos, campo de baixa confiança com destaque visual ("Revisão sugerida").
