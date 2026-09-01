# ObraCerta

Webapp de controle de obras (construção residencial e pequenas reformas): planejamento por etapas, execução de despesas, diário de obra e relatórios de orçado vs. realizado.

## Language

### Núcleo

**Construtora**:
O limite principal de tenant. Uma equipe de uma Construtora nunca vê Obras de outra Construtora.

**Obra**:
Um projeto de construção/reforma individual, pertencente a uma Construtora. Acesso a uma Obra pode vir automaticamente (membro da Construtora) ou de forma restrita a uma Obra específica (ex: Cliente).

### Despesas e recibo

**Despesa**:
Um gasto real vinculado a uma Obra (compra de material, serviço, mão de obra).
_Avoid_: Lançamento (usado só para o estado provisório — ver Lançamento provisório)

**Origem** (de uma Despesa):
`foto` ou `manual` — distingue se a Despesa nasceu de uma captura de Recibo ou foi lançada diretamente sem foto. Despesa de origem `manual` nunca tem Recibo associado.

**Lançamento provisório**:
Uma Despesa recém-criada por captura de Recibo, em status `pendente_confirmacao`, com a maioria dos campos ainda nulos — existe para garantir que o gasto nunca se perca, mesmo antes da extração/confirmação terminar.
_Avoid_: usar como sinônimo genérico de Despesa fora desse estado específico

**Recibo**:
O registro da captura fotográfica de um documento de despesa (nota fiscal ou recibo informal) e do pipeline de extração associado. Sempre 1:1 com uma Despesa de origem `foto`.
_Avoid_: usar "recibo" para o documento fiscal em si fora do sistema — aqui é a entidade

**Status de processamento** (de um Recibo):
Estado do upload/extração: `aguardando_upload` (registro criado, foto ainda não confirmada no Storage) → `pendente` (upload confirmado, aguardando extração) → `processado` | `falhou`. É a única fonte de verdade sobre o progresso do upload.
