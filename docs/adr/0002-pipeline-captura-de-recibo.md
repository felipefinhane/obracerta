---
Status: accepted
---

# Arquitetura do pipeline de captura de recibo

O fluxo de captura de recibo (`planejamento.md` seção 3) tem um requisito central: o gasto nunca pode se perder, mesmo capturado em conexão ruim no canteiro de obra ou na rua. Isso guiou quatro decisões arquiteturais amarradas entre si:

**1. O pipeline de extração (detecção de QR code + fallback OCR/LLM) roda em Supabase Edge Function, não em Route Handler do Next.js/Vercel.** O Vercel Hobby tem limite de duração de função apertado e inconsistente entre modos (10s no caso padrão, até ~60-300s dependendo de configuração de Fluid Compute); Supabase Edge Functions garantem 150s de wall-clock no free tier. Uma chamada de visão (Gemini Flash) somada a OCR pode facilmente passar de 10s, então rodar no Vercel arrisca timeout sistemático.

**2. A Edge Function é disparada por um Database Webhook em `recibos`, não por invocação direta do código que cria o lançamento.** ~~No `INSERT`~~ Na transição de `status_processamento` para `pendente` (ver Revisão abaixo) — não depende do cliente continuar conectado depois desse instante, e o Supabase reintenta automaticamente em caso de falha. Invocação direta (`fetch` explícito logo após a confirmação do upload) perderia o disparo silenciosamente se a rede caducasse nesse segundo passo.

**3. ~~O upload da foto vai direto do cliente para o Supabase Storage~~ — superada por ADR 0003.** O provedor de storage mudou para Cloudflare R2 (tier gratuito maior); upload e leitura passam por URL assinada emitida por um Route Handler, não mais por bucket com RLS do Supabase. Ver ADR 0003 para o desenho completo e o porquê.

**4. O registro em `despesas`/`recibos` é criado *antes* do upload da foto, não depois.** O upload de uma foto é a operação com maior chance de falhar em conexão ruim; se a ordem fosse upload-primeiro, uma falha nesse passo deixaria zero rastro do gasto — violando diretamente o requisito de que "a foto nunca se perde". Criando o registro primeiro (escrita pequena, rápida, mais provável de completar mesmo em 3G ruim) com um caminho de arquivo determinístico (`recibos/{id}.jpg`), o upload vira uma operação retomável contra um registro que já existe na tela de pendentes.

## Consequences

- `recibos.status_processamento` precisa de um valor para "registro criado, upload ainda não confirmado" distinto de "upload confirmado, aguardando processamento" — resolvido na Revisão abaixo.

## Revisão (sessão de grilling sobre o modelo de despesas/recibo)

A decisão 2 original ("Database Webhook no `INSERT` de `recibos`") contradizia a decisão 4: o registro é criado **antes** do upload, então no momento do `INSERT` a foto ainda não existe no Storage — disparar a extração nesse ponto rodaria contra um arquivo inexistente.

Correção: `recibos.status_processamento` ganha o valor `aguardando_upload` (estado inicial, setado no mesmo `INSERT` que cria o registro) e passa a ser a única fonte de verdade sobre o progresso do upload — `arquivo_url` deixa de ser nullable/flag e é preenchido já no `INSERT` com o caminho determinístico (`recibos/{id}.jpg`), já que é previsível a partir do `id` e não carrega mais nenhum sinal de estado. Quando o upload pro Storage confirma, o cliente faz `UPDATE recibos SET status_processamento = 'pendente'`; o Database Webhook passa a disparar **nessa transição**, não mais no `INSERT`. Se o upload nunca confirma, o registro fica em `aguardando_upload` indefinidamente — sem expiração automática no MVP —, disponível para retry manual que reusa o mesmo registro e caminho (não cria um lançamento novo). Detalhado em `modelo-dados.md`.
