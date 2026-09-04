# Subcategoria em Cadastros

Status: done

## Escopo

- `/cadastros`: form de categoria ganha select "Categoria pai (opcional)", populado só com categorias de nível principal (hierarquia de 2 níveis, sem sub-de-sub na UI).
- Lista de categorias vira hierárquica: categorias principais com suas subcategorias indentadas embaixo.

## Comments

- Sem mudança de schema/RLS — `categoria_pai_id` já existia desde `fundacao-tecnica`/04, só nunca tinha UI.
- **Testado de ponta a ponta de verdade contra o hospedado**: POST real do form criando "Cimento e Argamassa" como subcategoria de "Materiais de Construção" (categoria real da obra de demonstração) — confirmado via REST e visualmente (ícone de subcategoria indentado sob a categoria pai). Mantido como dado real, não é lixo de teste.
