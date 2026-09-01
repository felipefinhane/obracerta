# Export do Stitch

Telas geradas pelo [Stitch](https://stitch.withgoogle.com) a partir de `docs/design-prompt-stitch.md` (mobile) e `docs/design-prompt-stitch-desktop.md` (desktop). Cada pasta em `stitch_obra_certa/` é uma tela: `code.html` (markup/estilo gerado) + `screen.png` (screenshot renderizado). `obracerta_design_system/DESIGN.md` tem os tokens (cor, tipografia, espaçamento) que o Stitch definiu.

O `.zip` original fica só local (`.gitignore`) — o que está versionado é o conteúdo já extraído.

## Cobertura

15 telas pedidas no prompt original. Saiu:
- **14 telas mobile** (todas, exceto uma — ver gaps abaixo)
- **12 telas desktop** (das 13 que o prompt de desktop pediu)

## Gaps conhecidos (não corrigidos ainda, achados na primeira revisão)

- **"Nova Despesa Manual" não foi gerada** — nem mobile, nem desktop. É a única das 15 telas ausente nas duas rodadas. Precisa de uma solicitação extra ao Stitch se for usar essa tela como referência.
- **Deslize de vocabulário em pelo menos uma tela**: `confirmar_despesa_desktop` usa "+ Novo Projeto" no menu, onde deveria ser "+ Nova Obra" (o prompt pede explicitamente pra não trocar "Obra" por sinônimo). Vale conferir se aparece em outras telas antes de considerar o vocabulário fechado.

## Qualidade observada

A paleta e o tom que saíram (azul-marinho + laranja de segurança, alto contraste, pensado pra sol forte no canteiro) batem com a sugestão de tom visual do prompt original — o Stitch entendeu bem o contexto. `confirmar_despesa_desktop` em particular acertou o pedido específico do prompt: foto ao lado dos campos extraídos, campo de baixa confiança com destaque visual ("Revisão sugerida").
