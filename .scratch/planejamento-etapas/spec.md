# Planejamento — etapas, medição e orçado x realizado

Status: done

Quarto effort de UI do MVP. Fecha o ciclo que os três anteriores deixaram pendurado: `despesas-recibo` criou um cadastro **mínimo** de etapas (só nome/valor/datas, criar+listar, sem editar) só pra desbloquear os selects da despesa — este effort assume esse cadastro e completa o módulo de verdade: edição/exclusão de etapa, peso (%) e ordem, medição simplificada, e o relatório "Orçado vs. Realizado" que é o núcleo do produto (`docs/mvp.md` seção 1) e que até agora não aparece em lugar nenhum da UI, apesar da view (`orcado_vs_realizado`) já existir e ter sido testada desde `fundacao-tecnica`/06.

Mockups do Stitch como referência visual: `docs/stitch/stitch_obra_certa/{planejamento_de_etapas,planejamento_desktop,relat_rio_or_ado_x_realizado,relat_rio_or_ado_x_realizado_desktop}`.

## Escopo

- Editar etapa existente (nome, descrição, valor planejado, peso %, ordem, datas) e excluir etapa.
- Registrar medição simplificada por etapa: % concluído, data, observação — **sem fluxo de aprovação formal** (`docs/mvp.md`, isso é fase 2). Só criar + listar histórico, sem editar/excluir medição já lançada (mesmo nível de simplicidade do resto do MVP).
- Relatório "Orçado vs. Realizado": por etapa (usa a view `orcado_vs_realizado` já existente) e consolidado pra obra inteira (soma de todas as etapas + despesas sem etapa vinculada, que a view não cobre — despesa pode ter `etapa_id` nulo).

## Fora de escopo

- Fluxo de aprovação de medição (fase 2, depende de relatório formal pro banco que não existe ainda).
- Curva S / cronograma físico-financeiro (`docs/mvp.md` — depende de histórico acumulado de medição, que só existe depois de uso real).
- Editar/excluir medição já lançada.
- Recalcular automaticamente o peso (%) das outras etapas quando uma muda (a soma dos pesos pode não bater 100% — sem validação cruzada nesta v1, é só um campo informativo).

## Issues

01. RLS: update/delete em etapas, insert em medicoes
02. Editar e excluir etapa (peso %, ordem)
03. Medição por etapa
04. Relatório Orçado vs. Realizado (por etapa + consolidado)

Ordem: 01 bloqueia 02 e 03 (schema primeiro). 04 não depende de 02/03 tecnicamente (a view já existe e não usa peso/medição), mas fica por último porque só fica útil depois de etapas terem peso/valor ajustados de verdade.

## Comments

- 4/4 tickets fechados, testados de ponta a ponta contra o Supabase hospedado de verdade (mesmo método dos efforts anteriores — sem Docker local neste sandbox), incluindo o POST real do wire protocol dos Server Actions (criar/editar/excluir etapa, registrar medição) e não só chamada direta ao banco.
- Achado corrigido no ticket 01: `etapas` só tinha `select`+`insert`, faltava `update`/`delete`; `medicoes` só tinha `select`, faltava `insert` — quarta vez que esse tipo de gap aparece e é fechado num effort de UI (mesma classe de bug dos três efforts anteriores).
- O relatório Orçado vs. Realizado (ticket 04) valida o caso de estouro de orçamento de verdade (despesa de teste de R$30.000 contra planejado de R$25.000 na etapa real "Fundação") — visual de erro (barra vermelha, "Estourou o planejado") confirmado.
- Deploy: mudanças ainda não commitadas nem enviadas ao Vercel nesta sessão — fica pra quando o usuário pedir push, mesmo fluxo do effort anterior.
