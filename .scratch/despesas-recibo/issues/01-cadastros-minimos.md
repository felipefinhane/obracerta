# Cadastros mínimos — categorias, fornecedores, etapas

Status: pending

## Contexto

Bridge bloqueante descrito em `spec.md` — sem isso os selects de categoria/fornecedor/etapa das telas de despesa ficam vazios. Ver `docs/modelo-dados.md` seções "Planejamento" e "Cadastros de apoio" pro schema exato.

## Escopo

- `/cadastros`: form + lista de `categorias` (nome, tipo `produto|servico|mao_de_obra`) e `fornecedores` (nome, cnpj_cpf opcional, telefone opcional), ambos escopados por `construtora_id` da sessão.
- `/obras/[obraId]/etapas`: form + lista de `etapas` (nome, valor_planejado, datas previstas) escopadas por `obra_id`. Sem `peso_percentual`/`ordem` calculados ainda — se pedidos no form, aceitar null.
- Sem edição/exclusão, sem `categoria_pai_id` (subcategoria), sem `medicoes` — só criar e listar, o suficiente pra popular os selects de despesa.
- RLS já existe (`has_construtora_access`/`has_obra_access`, tickets 03/04/05 de `fundacao-tecnica`) — só consumir via client autenticado, mesmo padrão de `src/app/obras/actions.ts`.

## Comments
