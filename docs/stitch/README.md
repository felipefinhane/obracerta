# Export do Stitch

Telas geradas pelo [Stitch](https://stitch.withgoogle.com) a partir de `docs/design-prompt-stitch.md` (mobile) e `docs/design-prompt-stitch-desktop.md` (desktop). Cada pasta em `stitch_obra_certa/` é uma tela: `code.html` (markup/estilo gerado) + `screen.png` (screenshot renderizado). `obracerta_design_system/DESIGN.md` tem os tokens (cor, tipografia, espaçamento) que o Stitch definiu.

O `.zip` original fica só local (`.gitignore`) — o que está versionado é o conteúdo já extraído.

## Cobertura

15 telas pedidas no prompt original, todas presentes agora (depois da 3ª solicitação, `docs/design-prompt-stitch-nova-despesa-manual.md`):
- **15 telas mobile**
- **13 telas desktop**

## Gaps conhecidos

- ~~"Nova Despesa Manual" ausente~~ — **resolvido**, veio na atualização do zip (`nova_despesa_manual/` e `nova_despesa_manual_desktop/`).
- ~~Vocabulário "Projeto" vazando como sinônimo de "Obra"~~ — **resolvido**. A 4ª solicitação (`docs/design-prompt-stitch-fix-vocabulario.md`, pedindo correção sistemática com cada ocorrência listada) corrigiu 5 das 6: `lista_de_obras` (mensagem de progresso), `di_rio_de_obra`, `planejamento_desktop`, `relat_rio_or_ado_x_realizado_desktop`, `nova_despesa_manual_desktop`. A 6ª (`lista_de_obras/code.html`, texto do estado vazio) veio de novo com "projeto" — corrigida à mão direto no HTML (é texto puro, mais barato que outra volta no Stitch). **Nota**: o `screen.png` de `lista_de_obras/` ainda mostra o texto antigo ("projeto"), porque só o `code.html` foi editado aqui — o screenshot não foi re-renderizado. Se for usar o PNG como referência visual dessa tela, o texto do estado vazio está desatualizado nele.

## Qualidade observada

A paleta e o tom que saíram (azul-marinho + laranja de segurança, alto contraste, pensado pra sol forte no canteiro) batem com a sugestão de tom visual do prompt original — o Stitch entendeu bem o contexto. `confirmar_despesa_desktop` em particular acertou o pedido específico do prompt: foto ao lado dos campos extraídos, campo de baixa confiança com destaque visual ("Revisão sugerida").
