# Despesas e recibo

Status: done

Terceiro effort de UI do MVP, depois de `fundacao-tecnica` (schema/storage/pipeline) e `auth-bootstrap-obras` (login/cadastro/onboarding/Obras). Fecha o ciclo mais específico do produto (`docs/planejamento.md` §3, ADR 0002/0003): captura rápida de recibo na rua → lançamento provisório → extração assíncrona → confirmação → despesa real. Mockups do Stitch existem como referência visual (`docs/stitch/stitch_obra_certa/{confirmar_despesa,confirmar_despesa_desktop,nova_despesa_manual,nova_despesa_manual_desktop,extrato_de_despesas,extrato_de_despesas_desktop}`).

## Escopo

- Nova despesa manual (`origem = manual`) — já nasce `confirmada`, sem `recibo`.
- Captura de recibo pelo celular — cria `despesas` (`origem = foto`, `pendente_confirmacao`) + `recibos` (`aguardando_upload`, `arquivo_url` determinístico) **antes** do upload (ADR 0002 decisão 4), pede URL assinada de upload em `/api/storage/sign`, envia direto pro R2, depois marca `recibos.status_processamento = pendente` (dispara a Edge Function via webhook já existente).
- Recibos pendentes de confirmação — lista dos lançamentos provisórios do usuário.
- Confirmar despesa — abre um pendente, mostra a foto (URL assinada de leitura) ao lado de `dados_extraidos`, campos editáveis, itens de `despesa_itens`; ao confirmar, `despesas.status = confirmada` + `confirmado_em`.
- Extrato de despesas — lista despesas confirmadas de uma obra, com filtro por categoria/fornecedor/período (`docs/mvp.md` seção 1, "Relatórios").

### Bridge mínimo de cadastros (fora do escopo original de `Cadastros de apoio`/`Planejamento`, mas bloqueante)

`despesas`/`despesa_itens` referenciam `categoria_id`, `fornecedor_id` e `etapa_id`. Nenhuma tela pra criar essas linhas existe ainda (os efforts de Cadastros de apoio e Planejamento/Etapas não começaram) — sem isso os selects da confirmação e da despesa manual ficam vazios e o fluxo não é testável de ponta a ponta de verdade. Ticket 01 cobre só o mínimo pra desbloquear (criar + listar, sem edição/exclusão/subcategoria/peso/medição) — **não substitui** os efforts completos desses módulos, que ficam para depois com o resto do escopo (edição, hierarquia de categoria, orçado x realizado por etapa, etc.).

## Fora de escopo

- Detecção de QR code/chave de acesso NF-e (já é TODO explícito no ticket 09 de `fundacao-tecnica` — sem imagem de teste real).
- Edição/exclusão de despesa já confirmada, e retry de upload travado em `aguardando_upload` (ADR 0002 prevê o registro ficar disponível pra retry manual, mas a UI de retry fica pra depois — o registro não se perde, só não tem botão ainda).
- Relatório "Orçado vs. Realizado" (view já existe e foi testada em `fundacao-tecnica`/06, mas exibir isso de forma útil depende do módulo de Planejamento/Etapas ter mais do que criação mínima — fica pro effort de Planejamento).
- Módulo completo de Cadastros de apoio e Planejamento/Etapas (ver acima).
- Geolocalização do recibo (descartada, `planejamento.md` §7).
- Resiliência de conexão além do que o desenho já garante (registro criado antes do upload) — fila local/retry automático é PWA offline-first, fase 2 (`mvp.md`).

## Issues

01. Cadastros mínimos — categorias, fornecedores (construtora), etapas (obra)
02. Nova despesa manual
03. Captura de recibo (mobile)
04. Recibos pendentes de confirmação
05. Confirmar despesa
06. Extrato de despesas

Ordem: 01 bloqueia 02, 04 e 05 (dropdowns de categoria/fornecedor/etapa). 03 bloqueia 04 (precisa existir um pendente pra listar). 04 bloqueia 05 (confirmação parte de um item da lista). 02 e 05 já produzem despesas `confirmada`; 06 fica por último por depender de ter dado real pra listar/filtrar.

## Comments

- 6/6 tickets fechados, todos testados de ponta a ponta contra o projeto Supabase e o Cloudflare R2 hospedados de verdade (não só simulação local) — Docker local não está acessível neste sandbox, então toda a validação (RLS, upload real, pipeline de extração real via Gemini, POST real dos Server Actions) rodou direto contra o hospedado, usando uma sessão real do usuário (`felipefinhane@gmail.com`, obtida via magic-link admin, sem senha em mãos) e limpando o dado de teste ao final de cada ticket.
- Achado maior corrigido no ticket 01: `categorias`/`fornecedores`/`etapas` só tinham RLS de leitura, sem insert — mesma classe de gap que o effort anterior já tinha fechado pra `obras`/`despesas`.
- Ciclo completo validado de verdade numa única cadeia: captura (ticket 03) → pendente com extração real do `recibo_exemplo.jpg` (fornecedor, item, valor, confiança 0.95) → confirmação com os campos pré-preenchidos (ticket 05) → aparece no extrato (ticket 06). Um `503` transitório do Gemini na primeira tentativa de extração foi tratado corretamente como `falhou` pelo pipeline já existente (`fundacao-tecnica`/09), sem perder o lançamento — exatamente o comportamento que a ADR 0002 pedia.
- Deploy: mudanças ainda não subidas pro Vercel nesta sessão (só testadas contra o Supabase hospedado via `pnpm dev` local apontando pras credenciais de produção) — `git push` fica a critério do usuário.
