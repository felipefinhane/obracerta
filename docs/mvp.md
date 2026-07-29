# MVP — Escopo da v1

> Complementa `docs/planejamento.md`. Este arquivo define o que entra na primeira versão funcional e o que fica para depois, com o raciocínio do corte.

Critério de corte: a v1 precisa entregar o ciclo **planejar etapa → gastar → registrar recibo → comparar orçado x realizado → acompanhar via diário**, que é o valor central do sistema. Tudo que é "prestação de contas formal ao banco" ou "otimização operacional" (estoque, contratos, alertas) fica para depois, porque só faz sentido quando já existe volume de dados real rodando.

---

## 1. Dentro do MVP

### Obras
- Cadastro de obra (endereço, cliente, construtora, datas previstas, valor total planejado).
- Multi-obra desde o início (uma conta pode ter mais de uma obra) — modelo de dados já isola por `obra_id`, mesmo que a UI de troca de obra seja simples no começo.

### Planejamento
- Etapas: nome, descrição, valor planejado, peso (%) sobre o total, datas previstas, ordem.
- Orçado vs. Realizado por etapa (comparação automática, é o núcleo do sistema).
- Medição simplificada: % concluído por etapa, com data e observação. **Sem fluxo de aprovação formal** na v1 (isso vem na fase 2, quando entrar o relatório de medição para o banco).

### Cadastros de apoio
- Categorias / subcategorias (produto, serviço, mão de obra).
- Fornecedores (cadastro simples: nome, CNPJ/CPF, contato) — sem contratos vinculados ainda.
- Construtora + equipe + papéis de acesso: Admin, Engenheiro/mestre de obra, Financeiro, Cliente (leitura). *Auditor de banco fica para fase 2.*

### Despesas + captura de recibo
- Fluxo completo descrito em `planejamento.md` seção 3: captura rápida no celular → lançamento provisório `pendente de confirmação` → processamento assíncrono → tela de confirmação.
- Dois pipelines de extração: detecção de QR code/chave de acesso (NF-e) e fallback OCR/LLM de visão para recibo informal.
- Resiliência básica de conexão: se o upload falhar por falta de sinal, o app guarda localmente e tenta reenviar quando a conexão voltar. **Não é offline-first completo** (isso é fase 2) — é só não perder o lançamento se a rede cair no meio do envio.

### Diário de obra
- Lançamento com fotos/vídeos, texto, clima, efetivo presente, ocorrências, vínculo opcional a uma etapa.

### Relatórios
- Orçado vs. Realizado (por etapa e consolidado).
- Extrato de despesas por categoria/fornecedor/período.

---

## 2. Fora do MVP (fase 2+)

| Item | Por quê fica pra depois |
|---|---|
| Recebimentos (parcelas de financiamento) e conciliação bancária | Módulo financeiro separado, só faz sentido com o ciclo de despesas já validado em uso real |
| Contratos com fornecedores/subempreiteiros | Adiciona controle de saldo consumido — complexidade que não bloqueia o valor central |
| Curva S / cronograma físico-financeiro (visualização) | Depende de histórico de medição acumulado, que só existe depois de algumas etapas medidas |
| Relatório de medição formal para o banco + aprovação de medição | Depende de ter clientes reais pedindo isso — evita desenhar aprovação "no escuro" |
| Almoxarifado/estoque | Otimização operacional, não bloqueia o controle financeiro básico |
| Documentos da obra (plantas, ART/RRT, alvará) | Repositório de arquivo simples, fácil de adicionar depois sem mexer no resto |
| Alertas/notificações | Precisa de volume de uso real para definir os gatilhos que realmente importam |
| PWA offline-first completo (fila local + background sync) | Fica só a resiliência básica de reenvio na v1; offline completo é investimento técnico maior |
| Papel "Auditor do banco" | Só relevante quando o relatório de medição formal existir |
| Curva ABC de insumos | Relatório avançado, baixo valor sem volume de dados |

---

## 3. Próximo passo

Modelo de dados detalhado para o escopo acima em `docs/modelo-dados.md`.
