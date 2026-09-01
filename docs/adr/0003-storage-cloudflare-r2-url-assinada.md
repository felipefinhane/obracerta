---
Status: accepted
---

# Armazenamento de arquivo via Cloudflare R2, com upload e leitura por URL assinada

O MVP roda inteiramente em tiers gratuitos, e o tier gratuito de Storage do Supabase (1GB storage, 5GB egress) enche rápido com fotos de recibo e mídia do diário de obra. Decidimos usar **Cloudflare R2** (10GB storage grátis/mês, egress ilimitado grátis) para armazenar arquivos, mantendo Supabase só para Postgres/Auth/Edge Functions (ADR 0001).

R2 não tem RLS ligada ao Postgres como o Supabase Storage — que motivou o desenho original de upload direto do cliente com bucket RLS (ADR 0002, decisão 3, **superada por este ADR**). Em vez disso:

- Um Route Handler no Next.js/Vercel emite URLs assinadas (presigned) de upload e leitura, sob demanda. Gerar uma URL assinada é uma operação rápida, sem risco do limite de duração que motivou rodar a extração em Edge Function (ADR 0002, decisão 1).
- Antes de emitir a URL, o Route Handler **não confia num `obra_id` vindo do cliente** — isso abriria um "confused deputy": alguém poderia alegar acesso a uma obra que é dela pedindo a URL de um recibo que não é. Em vez disso, ele busca a linha (`recibos`/`diario_midia`) usando o client Supabase autenticado da própria sessão do usuário (`src/lib/supabase/server.ts`) — a policy de `select` dessas tabelas (que já usa `has_obra_access` via join com `despesas`/`diario_entradas`) filtra sozinha quem não tem acesso. Se a linha voltar, o acesso já está provado; o caminho no R2 vem do próprio `arquivo_url` da linha (fonte única de verdade do path). Continua sendo uma **exceção documentada** ao princípio "RLS como fonte de verdade" do ADR 0001 no sentido de que a chamada ao R2 em si não passa por RLS — mas a autorização de *quem pode pedir a URL* é a RLS de verdade, não uma reimplementação em JS.
- O bucket é privado. Leitura (tela de confirmação, diário, relatórios) também passa por URL assinada gerada sob demanda, não por link público — evita expor foto de recibo (CNPJ, valores) a quem descobrir a URL por acidente, sem custo real já que egress no R2 é grátis mesmo assinado.
- `recibos.arquivo_url` e `diario_midia.arquivo_url` guardam o **caminho/chave do objeto no R2** (determinístico, ex. `recibos/{id}.jpg`), não uma URL resolvível diretamente — a URL de leitura é sempre gerada na hora.

## Considered Options

- **Manter Supabase Storage**: zero mudança arquitetural (upload direto com RLS de bucket), mas 1GB grátis enche rápido, principalmente com mídia do diário de obra.
- **Cloudinary**: compressão/transformação automática embutida, mas os 25 créditos/mês são compartilhados entre storage, bandwidth e transformação — esgota rápido se também subir vídeo.

## Consequences

- A Edge Function de extração (ADR 0002) passa a buscar o arquivo no R2 via credenciais S3-compatíveis (secrets da Edge Function), não mais lendo do Storage do mesmo projeto Supabase.
- Toda leitura de foto na aplicação passa por um endpoint que gera URL assinada — não é mais um link direto cacheável pelo navegador sem essa checagem.
- Fotos de recibo são comprimidas no cliente antes do upload (ex.: máx. ~1600px, JPEG ~70%) para render o tier gratuito mais longe — resolução alta não ajuda o OCR/LLM de extração.
- Vídeo no diário de obra fica fora do MVP (só foto) — ver `mvp.md`. Volta a ser avaliado quando o volume de uso real justificar o custo de storage.
