# Diário de obra

Status: em andamento

Quinto effort de UI do MVP — o último módulo funcional que falta pra fechar o `docs/mvp.md` inteiro (o que resta depois disso, Recebimentos/conciliação, já está marcado como fase 2, fora do MVP). Schema já existe desde `fundacao-tecnica`/07 (`diario_entradas`, `diario_midia`) e já tem policy de `select`/`insert` prontas (`fundacao-tecnica`/07 e a migration de escrita do mesmo effort) — **sem gap de RLS pra fechar desta vez**, ao contrário dos quatro efforts anteriores.

Mockups do Stitch como referência visual: `docs/stitch/stitch_obra_certa/{novo_lan_amento_de_di_rio,di_rio_de_obra,di_rio_de_obra_desktop}`.

## Escopo

- Novo lançamento: data, clima, descrição (atividades/progresso), efetivo presente, ocorrências, etapa vinculada (opcional), uma ou mais fotos. Ao contrário do fluxo de despesa/recibo, aqui **não existe pipeline de extração** — texto e fotos são enviados juntos na mesma tela, sem estado provisório.
- Timeline do diário: lista os lançamentos da obra, mais recente primeiro, com as fotos anexadas (via URL assinada de leitura).

## Fora de escopo

- Edição/exclusão de lançamento já criado — é um registro histórico (mesmo espírito de `medicoes`, `planejamento-etapas`).
- Vídeo (`mvp.md` — fora do MVP, tier gratuito de storage).
- Qualquer processamento assíncrono da foto (aqui a foto é só anexo, não passa por extração).

## Issues

01. Novo lançamento de diário (form + upload de fotos)
02. Timeline do diário de obra

Ordem: 01 antes de 02 só pra ter dado real pra visualizar na timeline durante o desenvolvimento — não são tecnicamente dependentes (RLS de leitura já existe desde `fundacao-tecnica`).

## Comments
