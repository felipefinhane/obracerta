# Recebimentos e conciliação bancária

Status: em andamento

Item 2 do pedido do usuário em 2026-09-04. Módulo marcado como fase 2 em `docs/mvp.md` ("só faz sentido com o ciclo de despesas já validado em uso real") — nunca foi desenhado em detalhe (sem seção em `docs/modelo-dados.md`, sem ADR). `docs/mvp.md` §2.5 descreve o funcional em alto nível: entradas (parcela de financiamento, aporte do cliente), saídas (pagamentos), conciliação bancária (import de extrato OFX/CSV), resultado em fluxo de caixa. Este spec fecha o desenho que faltava.

## Decisões de produto (registradas, não ficam em aberto)

- **Saídas não é tabela nova** — `despesas` já confirmada **é** a saída de caixa da obra. Duplicar como um "pagamento" separado criaria duas fontes de verdade pro mesmo dinheiro saindo. `docs/mvp.md` cita "saídas: pagamentos a fornecedores/mão de obra" — é exatamente o que `despesas` já registra.
- **`recebimentos` registra dinheiro que já entrou, não previsão futura** — mesmo nível de simplicidade do resto do MVP (nenhum outro módulo tem estado "planejado vs. realizado" no nível de lançamento individual, só agregado via `orcado_vs_realizado`). Fluxo de caixa **previsto** (ex: cronograma de parcelas de financiamento ainda não liberadas) fica de fora — se aparecer necessidade real, é extensão futura, não redesenho.
- **Conciliação bancária cobre só CSV nesta v1, sem OFX** — OFX é um formato próprio (SGML) que exigiria um parser dedicado; CSV com três colunas (data, descrição, valor) cobre o mesmo objetivo funcional (bater extrato contra lançamento) com uma fração do esforço. OFX fica anotado como extensão futura, não descartado.
- **Sem matching automático** — o usuário vincula cada linha importada a uma despesa ou recebimento existente manualmente (dropdown/busca). Heurística de matching automático (por valor+data aproximados) é otimização que só vale a pena com volume real de uso, mesmo raciocínio de outros cortes de escopo do projeto.
- **Recibo/comprovante de recebimento**: fora de escopo — recebimento é só um lançamento de valor+data+descrição, sem captura de foto (diferente de despesa, que tem o fluxo de recibo). Se aparecer necessidade real de anexar comprovante, é extensão futura.

## Escopo

- Tabela `recebimentos`: obra, etapa (opcional), tipo (`parcela_financiamento` | `aporte_cliente`), valor, data, descrição.
- Tabela `transacoes_bancarias`: linha importada de um CSV de extrato — data, descrição, valor, vínculo opcional a uma despesa ou a um recebimento (nunca os dois).
- Lançar/listar recebimentos por obra.
- Relatório de fluxo de caixa: entradas (recebimentos) x saídas (despesas confirmadas) por período, saldo acumulado.
- Importar CSV de extrato + tela de vincular cada transação a uma despesa/recebimento existente (ou deixar sem vínculo).

## Fora de escopo

- Import de OFX (ver decisão acima).
- Matching automático de conciliação (ver decisão acima).
- Alçada de aprovação de recebimento/pagamento.
- Edição/exclusão de recebimento e de transação importada — mesmo corte de simplicidade already aplicado em `medicoes`/`diario_entradas` (registro histórico, sem edição na v1). Reavaliar se aparecer necessidade real.

## Issues

01. Schema: `recebimentos`, `transacoes_bancarias`, RLS
02. Lançar e listar recebimentos por obra
03. Fluxo de caixa (relatório)
04. Conciliação bancária: importar CSV + vincular

Ordem: 01 bloqueia os demais. 02 bloqueia 03 (fluxo de caixa precisa de recebimentos existindo pra fazer sentido testar). 04 é independente de 02/03, mas faz mais sentido por último (produto mais específico).

## Comments
