# ObraCerta — Documento de Planejamento

> **Como usar este arquivo**: este documento é a base de contexto para continuarmos o planejamento do sistema em conversas futuras (com IA ou não). Ele reúne o que já foi decidido, o que ficou em aberto e o raciocínio por trás das escolhas. Antes de propor arquitetura, modelo de dados ou começar a implementar, leia este arquivo inteiro — ele deve ser atualizado sempre que uma decisão nova for tomada ou um requisito mudar.

**Nome do projeto**: ObraCerta.
**Status**: planejamento funcional fechado (escopo do MVP, modelo de dados e decisões-chave definidos) — próximo passo é arquitetura técnica.

---

## 1. Visão geral

Webapp para controle de obras (construção de casa ou pequenas reformas), cobrindo o ciclo completo:

1. **Planejamento** da obra em etapas, com o que será feito e quanto vai custar em cada uma.
2. **Execução**: lançamento de despesas reais (compras de material, serviço, mão de obra) durante a obra.
3. **Financeiro**: recebimentos (normalmente parcelas de financiamento de construção, ex. Caixa Econômica) vinculados ao planejamento, e conciliação bancária.
4. **Acompanhamento**: diário de obra com fotos/vídeos do andamento.
5. **Relatórios** que amarram tudo isso — incluindo os que servem para prestar contas ao banco financiador.

Motivador central: o dono da obra (ou construtora) precisa comprovar ao banco financiador o andamento físico e o uso dos recursos liberados por etapa, para destravar as próximas parcelas do financiamento. Isso empurra o desenho do sistema para ter **orçado vs. realizado por etapa** e **% de medição física** como conceitos de primeira classe, não como extra.

---

## 2. Módulos funcionais

### 2.1 Obras (cadastro raiz)
- Uma conta pode gerenciar uma ou mais obras (multi-obra desde o início — decisão em aberto sobre isolamento de dados, ver seção 6).
- Dados básicos: endereço, cliente/dono, construtora responsável, datas previstas, valor total planejado.

### 2.2 Planejamento
- **Etapas** (ex: fundação, alvenaria, cobertura, acabamento): descrição do que será feito, custo planejado, peso (%) sobre o total da obra, datas previstas.
- **Cronograma físico-financeiro**: cada etapa tem peso financeiro e físico ao longo do tempo — necessário para gerar curva S e sustentar pedidos de liberação de parcela ao banco.
- **Orçado vs. Realizado**: comparação obrigatória por etapa/categoria — é o núcleo do controle de obra.
- **Medição de obra**: lançamento periódico de % concluído por etapa, idealmente com aprovação (engenheiro/mestre de obra assina). É o dado que embasa o pedido de liberação de parcela.
- Curva ABC de insumos: desejável, não crítico para MVP.

### 2.3 Cadastros de apoio
- **Categorias / subcategorias** de produto, serviço, mão de obra.
- **Fornecedores**: separado de "construtora". Fornecedor de material, prestador de serviço e subempreiteiro têm cadastro próprio (CNPJ/CPF, contato, histórico de compras).
- **Contratos**: com fornecedores, mão de obra terceirizada, subempreiteiros — valor total, forma de pagamento, saldo consumido conforme despesas são lançadas contra o contrato.
- **Construtora + equipe**: cadastro da construtora responsável, membros da equipe e seus tipos de acesso (ver 2.7).

### 2.4 Despesas — captura de recibo/nota fiscal
Esse é o módulo com o fluxo mais específico. Ver seção 3 (fluxo detalhado) — aqui só o resumo funcional:

- Duas fontes de dado muito diferentes:
  1. **Recibo informal** (impressora térmica, layout livre, sem padrão — ex. `recibo_exemplo.jpg`): extração via OCR + LLM de visão, sujeita a erro, **sempre passa por confirmação humana**.
  2. **NF-e/NFC-e real** (com QR code e chave de acesso de 44 dígitos): dado estruturado, consulta direta via chave de acesso, muito mais confiável — não precisa de OCR.
- O sistema deve tentar detectar QR code primeiro; se não achar, cai para o pipeline de OCR genérico.
- **Fluxo mobile-first**: usuário fotografa o recibo pela rua/canteiro de obra, sem precisar preencher nada além do essencial na hora. A confirmação dos dados extraídos acontece depois, com calma, quando ele acessa o sistema (celular ou desktop). Detalhado na seção 3.

### 2.5 Recebimentos e conciliação
- **Entradas**: parcelas de financiamento (vinculadas à medição/etapa), aporte próprio do cliente.
- **Saídas**: pagamentos a fornecedores/mão de obra.
- **Conciliação bancária**: import de extrato (OFX/CSV como ponto de partida; Open Finance como evolução futura) batendo contra os lançamentos do sistema.
- Resultado: fluxo de caixa real da obra, não só "quanto já gastei".

### 2.6 Diário de obra
- Lançamento do andamento com fotos e/ou vídeos.
- Complementos recomendados:
  - Clima do dia (justifica atrasos de cronograma).
  - Efetivo presente (quantas pessoas/quais equipes trabalharam).
  - Ocorrências (problema, acidente, atraso de material).
  - Vínculo opcional a uma etapa do planejamento.

### 2.7 Construtora, equipe e tipos de acesso
Papéis previstos:
- **Admin** / dono da conta.
- **Engenheiro/mestre de obra**: lança etapas, aprova medição.
- **Financeiro**: lança despesas, faz conciliação.
- **Cliente/dono do imóvel**: leitura — acompanha sem editar.
- **Auditor/perito do banco**: leitura restrita a relatórios específicos (se o sistema for usado para prestar contas de financiamento).

### 2.8 Relatórios
Deve cobrir no mínimo:
- Orçado vs. Realizado (por etapa e consolidado).
- Curva S (físico-financeiro).
- Extrato de despesas por categoria/fornecedor/período.
- Relatório de medição (para pedido de liberação de parcela ao banco).
- Fluxo de caixa (entradas x saídas).

### 2.9 Módulos identificados mas fora do escopo inicial (backlog)
- **Almoxarifado/estoque simplificado**: material comprado vs. usado (ajuda a identificar desperdício/desvio).
- **Documentos da obra**: plantas, ART/RRT, alvará, contrato de financiamento — repositório de arquivos não ligado a despesa.
- **Alertas**: estouro de orçamento por etapa, parcela de financiamento não bate com % de medição, etc.
- **PWA offline completo**: canteiro de obra costuma ter internet ruim — fila local + sync quando voltar conexão. Tratado como requisito técnico transversal, não módulo isolado (ver seção 4).

---

## 3. Fluxo detalhado: captura de recibo pelo celular → confirmação depois

Requisito explícito do usuário: **agilidade na rua**. A pessoa está no balcão da loja ou no canteiro, não pode/quer preencher formulário ali. O fluxo precisa separar claramente "capturar" de "confirmar".

**Passo 1 — Captura (mobile, rápida)**
- Usuário abre o app no celular, tira foto do recibo/nota (ou escolhe da galeria).
- Único input obrigatório no momento da captura: qual obra (se o usuário só tem acesso a uma obra, nem isso é perguntado — some).
- Nada de categoria, etapa, fornecedor ou valor exigido nesse momento — tudo isso é preenchido na confirmação.
- Foto é enviada (ou enfileirada localmente se estiver offline) com metadados automáticos: obra, usuário, timestamp, geolocalização (opcional).
- Ao enviar, já é criado um **lançamento provisório** com status `pendente de confirmação` — isso é importante: o gasto já existe no sistema (não se perde), mesmo antes da extração terminar.

**Passo 2 — Processamento (assíncrono, em background)**
- Sistema tenta detectar QR code / chave de acesso na imagem (caminho NF-e estruturado).
- Se não encontrar, roda OCR + LLM de visão para extrair: fornecedor, data, itens, valores unitários, total.
- Resultado (mesmo que parcial ou de baixa confiança) fica associado ao lançamento provisório. Se a extração falhar completamente, o lançamento continua na fila de pendentes para preenchimento manual — a foto nunca se perde.

**Passo 3 — Confirmação (quando o usuário tiver tempo, celular ou desktop)**
- Tela de **"Recibos pendentes de confirmação"**: lista de todos os lançamentos provisórios (pode ter vários acumulados do dia).
- Ao abrir um item: foto ao lado dos campos extraídos, editáveis.
- Usuário completa o que falta (categoria, subcategoria, etapa vinculada, fornecedor se não veio automático) e confirma.
- Ao confirmar, o lançamento provisório vira uma **despesa real**, entra no orçado vs. realizado da etapa.
- Itens de baixa confiança na extração devem ser sinalizados visualmente para o usuário revisar com mais atenção (ex: campo destacado).

Esse desenho resolve o requisito diretamente: captura em segundos na rua, confirmação em lote depois, sem bloquear o usuário no momento da compra.

---

## 4. Stack técnica (proposta inicial, a validar)

- **Next.js (React)** para o webapp, com PWA (service worker + manifest) para suportar captura offline no celular.
- **Supabase** (Postgres + Auth + Storage):
  - RLS (Row Level Security) para o modelo de permissões por obra/papel — evita reinventar controle de acesso na camada de aplicação.
  - Storage para fotos de recibo, vídeos/fotos do diário de obra.
  - Edge Functions para rodar o pipeline de extração de recibo (detecção de QR code → consulta NF-e ou fallback OCR/LLM) de forma assíncrona, sem travar o upload.
- Fila local (IndexedDB) + background sync no service worker para suportar captura sem internet no canteiro — ponto tecnicamente mais delicado do projeto, tratar com atenção quando chegar na implementação.

---

## 5. Papéis e permissões — resumo técnico
(Ver 2.7 para a visão funcional.) Modelar como obra → membros → papel, com RLS filtrando por obra. Cliente e auditor de banco são sempre leitura; demais papéis têm escrita conforme o módulo.

---

## 6. Decisões em aberto / perguntas pendentes

- **Consulta de NF-e via chave de acesso**: definir se via SEFAZ diretamente ou serviço terceiro (custo/limites) — adiado para fase 2, nada contratado agora.
- **Migração do provedor de extração de recibo**: quando sair da fase de testes (free tier do Gemini), decidir se migra para Claude Sonnet 5 (mais preciso em recibo informal bagunçado) ou mantém Gemini pago — reavaliar com base na taxa de erro observada em uso real.
- **Infraestrutura pós-teste (AWS)**: sinalizado como opção a explorar quando o produto sair da fase gratuita, sem desenho ainda.
- **Próximo passo**: arquitetura técnica (estrutura do projeto Next.js, schema SQL + políticas de RLS no Supabase, desenho do pipeline de extração de recibo) — ainda não iniciado.

---

## 7. Histórico de decisões

- Confirmado: fluxo de recibo separa **captura rápida no celular** de **confirmação posterior** (lançamento provisório com status pendente, nunca bloqueia o usuário na hora da compra).
- Confirmado: dois pipelines de extração distintos (NF-e estruturada via QR code vs. OCR/LLM para recibo informal).
- Confirmado: stack inicial Next.js + Supabase.
- Confirmado: escopo do MVP definido em `docs/mvp.md` — v1 cobre Obras, Planejamento (com medição simplificada, sem aprovação formal), Cadastros de apoio, Despesas/recibo completo, Diário de obra, e relatórios de Orçado x Realizado e extrato de despesas. Recebimentos/conciliação, contratos, curva S, relatório de medição para banco, almoxarifado, documentos, alertas e PWA offline-first completo ficam para fase 2.
- Confirmado: modelo de dados do MVP desenhado em `docs/modelo-dados.md`.
- Confirmado: fase de testes roda 100% em tiers gratuitos — Vercel Hobby (uso pessoal/teste, não comercial) + Supabase Free (500MB banco, 1GB storage, 5GB egress) + sem domínio próprio ainda (usar subdomínio `*.vercel.app`). Único custo real nessa fase é a API da Claude por chamada de extração de recibo (centavos, não tem tier gratuito). Consulta de NF-e fica adiada — nada contratado agora.
- Anotado: AWS é considerada como opção de infraestrutura para quando o produto sair da fase de testes e precisar de algo mais robusto — não detalhado ainda, só sinalizado para revisitar mais à frente.
- Confirmado: nome do projeto é **ObraCerta**.
- Confirmado: isolamento de dados em **dois níveis** — construtora é o limite principal de tenant (equipe de uma construtora só vê as obras dela), e dentro disso, acesso fino por obra via `obra_membros` (ex: um cliente vê só a obra dele, não todas as obras da construtora). Detalhado em `docs/modelo-dados.md`.
- Confirmado: categorias e fornecedores são **compartilhados entre as obras da mesma construtora** (cadastra uma vez, reusa em qualquer obra).
- Confirmado: provedor de extração de recibo na fase de testes é o **Google Gemini (família Flash)**, que tem tier gratuito contínuo (não é crédito único como a Claude API) — ver seção 8. Migração para Claude Sonnet 5 fica em aberto para quando sair da fase de testes.

## 8. Stack de testes (fase atual)

- **Vercel Hobby** (grátis): hospeda o Next.js. Atenção: não é permitido para uso comercial — serve para testar com você mesmo ou usuários convidados informalmente, não para operar a obra de um cliente pagante.
- **Supabase Free** (grátis): Postgres + Auth + Storage. Dois pontos de atenção: projeto pausa após 1 semana sem uso (precisa reativar manualmente), e os limites de storage (1GB) enchem rápido se subir foto/vídeo do diário de obra à vontade — vale já nascer com algum limite de tamanho/compressão no upload, mesmo em teste.
- **Sem domínio próprio**: usar o subdomínio gratuito do Vercel enquanto for teste.
- **Google Gemini API (família Flash)** para o pipeline de extração de recibo: tier gratuito real e contínuo (não é crédito que acaba), na faixa de ~1.500 requisições/dia — dá folga de sobra para volume de teste. Atenção: assim que ativar cobrança (billing) nesse mesmo projeto do Google Cloud, o tier gratuito desaparece por completo — manter um projeto dedicado só para isso enquanto for teste.
  - A Claude API (Sonnet 5) fica como opção de qualidade superior para quando sair da fase de testes: não tem tier gratuito contínuo, só ~US$5 de crédito único por conta nova, mas costuma ser mais precisa em recibos informais bagunçados (letra ruim, layout de impressora térmica).
- **NF-e (consulta por chave de acesso)**: fora de escopo por enquanto — nem SEFAZ direto nem serviço terceiro contratado nessa fase.
