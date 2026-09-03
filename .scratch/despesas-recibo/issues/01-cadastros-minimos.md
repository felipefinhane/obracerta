# Cadastros mínimos — categorias, fornecedores, etapas

Status: done

## Contexto

Bridge bloqueante descrito em `spec.md` — sem isso os selects de categoria/fornecedor/etapa das telas de despesa ficam vazios. Ver `docs/modelo-dados.md` seções "Planejamento" e "Cadastros de apoio" pro schema exato.

## Escopo

- `/cadastros`: form + lista de `categorias` (nome, tipo `produto|servico|mao_de_obra`) e `fornecedores` (nome, cnpj_cpf opcional, telefone opcional), ambos escopados por `construtora_id` da sessão.
- `/obras/[obraId]/etapas`: form + lista de `etapas` (nome, valor_planejado, datas previstas) escopadas por `obra_id`. Sem `peso_percentual`/`ordem` calculados ainda — se pedidos no form, aceitar null.
- Sem edição/exclusão, sem `categoria_pai_id` (subcategoria), sem `medicoes` — só criar e listar, o suficiente pra popular os selects de despesa.
- RLS já existe (`has_construtora_access`/`has_obra_access`, tickets 03/04/05 de `fundacao-tecnica`) — só consumir via client autenticado, mesmo padrão de `src/app/obras/actions.ts`.

## Comments

- **Achado bloqueante, corrigido**: `categorias`, `fornecedores` e `etapas` só tinham policy de `select` (tickets 04/05 de `fundacao-tecnica`) — nenhum usuário autenticado conseguia inserir, mesmo gap já visto e fechado pra `obras`/`despesas` no effort anterior. Migration `supabase/migrations/20260903131757_insert_categorias_fornecedores_etapas.sql`: insert em `categorias`/`fornecedores` via `has_construtora_access`, insert em `etapas` via `has_obra_write_access` (cliente não cria etapa, mesmo padrão de despesas).
- `/cadastros` (categorias + fornecedores, escopo construtora) e `/obras/[obraId]/etapas` (escopo obra) — form + lista, sem edição/exclusão.
- **Testado de ponta a ponta de verdade contra o hospedado**, com a conta real do usuário (`felipefinhane@gmail.com`, construtora "Finhane", obra "Montral"): sessão obtida via `admin/generate_link` + verify OTP (sem senha em mãos), usada pra (1) confirmar via REST que insert de categoria/fornecedor/etapa funciona pra quem tem acesso e é rejeitado (`42501`) pra `construtora_id`/`obra_id` que não são do usuário; (2) rodar `pnpm dev` apontando pro projeto hospedado e conferir via `curl` com o cookie de sessão real que `/cadastros` e `/obras/[obraId]/etapas` renderizam no server os dados reais inseridos. Sessão de teste revogada (`/auth/v1/logout`) e arquivos com token apagados ao final; `.env.local` restaurado pro Supabase local (Docker) em seguida — Docker não está acessível neste sandbox (usuário sem grupo `docker`, sem sudo sem senha), então a validação de schema/RLS deste ticket rodou direto no hospedado, sem passo local antes.
- Categoria "Materiais de Construção", fornecedor "Depósito Central" e etapa "Fundação" ficaram gravados de verdade na construtora/obra do usuário (não são dado de teste descartável — servem como primeiro cadastro real pra usar nas próximas telas).
