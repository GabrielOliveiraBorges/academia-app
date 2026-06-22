# Especificação da Funcionalidade — Gerenciamento de Treinos (FitApp)

**Branch/Pasta:** `specs/001-fitapp-gerenciamento-treinos/`
**Status:** Implementada
**Criada em:** 2026-06-22

> Especificação retroativa (reverse spec) do FitApp, escrita para alinhar o
> projeto existente ao processo Spec-Driven Development. Descreve **o quê** e
> **por quê**.

## 1. Resumo
Permitir que um aluno de academia gerencie seus treinos (criar, visualizar,
editar, excluir), monte os exercícios de cada treino e registre a conclusão
das sessões, acompanhando estatísticas de progresso — tudo a partir do celular
(e da versão web).

## 2. Cenários de Usuário (User Stories)

- **Como** aluno, **quero** entrar com e-mail e senha, **para** acessar meus
  próprios treinos.
- **Como** aluno, **quero** ver um painel com total de treinos, concluídos e a
  última execução, **para** acompanhar meu progresso.
- **Como** aluno, **quero** criar/editar/excluir treinos, **para** organizar
  minha rotina.
- **Como** aluno, **quero** adicionar exercícios (séries, reps, carga,
  descanso) a um treino, **para** detalhar a execução.
- **Como** aluno, **quero** marcar um treino como concluído, **para** registrar
  meu histórico.

### Critérios de Aceite (Given/When/Then)
- **Dado** um e-mail cadastrado e senha correta, **quando** faço login,
  **então** sou levado ao painel com meus treinos.
- **Dado** um e-mail não cadastrado, **quando** tento logar, **então** vejo
  "E-mail não cadastrado!".
- **Dado** um e-mail cadastrado e senha errada, **quando** tento logar,
  **então** vejo "Senha incorreta!".
- **Dado** que estou logado, **quando** crio um treino com nome e tipo,
  **então** ele passa a aparecer na minha lista.
- **Dado** um treino existente, **quando** edito seu nome e salvo, **então** a
  lista reflete o novo nome.

## 3. Requisitos Funcionais

| ID | Requisito | Prioridade |
|----|-----------|------------|
| FR-001 | O sistema DEVE autenticar o usuário por e-mail e senha consultando `/usuarios`. | Alta |
| FR-002 | O sistema DEVE exibir mensagem específica para e-mail inexistente e para senha incorreta. | Alta |
| FR-003 | O sistema DEVE manter a sessão persistida entre recarregamentos (AsyncStorage). | Média |
| FR-004 | O sistema DEVE exibir um painel com total de treinos, concluídos e data do último treino. | Alta |
| FR-005 | O sistema DEVE listar apenas os treinos do usuário logado. | Alta |
| FR-006 | O sistema DEVE permitir criar um treino (nome, tipo, descrição, duração). | Alta |
| FR-007 | O sistema DEVE validar que nome e tipo são obrigatórios ao salvar um treino. | Alta |
| FR-008 | O sistema DEVE permitir editar um treino existente. | Alta |
| FR-009 | O sistema DEVE permitir excluir um treino (e seus exercícios vinculados). | Média |
| FR-010 | O sistema DEVE exibir os detalhes de um treino com seus exercícios. | Alta |
| FR-011 | O sistema DEVE permitir adicionar/editar/remover exercícios de um treino. | Média |
| FR-012 | O sistema DEVE permitir marcar um treino como concluído, gravando no histórico. | Média |
| FR-013 | O sistema DEVE permitir logout, encerrando a sessão. | Média |

## 4. Requisitos Não-Funcionais

| ID | Requisito | Métrica |
|----|-----------|---------|
| NFR-001 | Segurança avaliada contra OWASP Top 10, com status documentado. | `docs/SECURITY-OWASP.md` |
| NFR-002 | Cobertura E2E mínima de 10 casos Playwright com print por desenvolvedor. | `tests/` + `tests/evidencias/` |
| NFR-003 | Interface utilizável em tela mobile (portrait) e na web (Expo Web). | Layout responsivo |
| NFR-004 | Feedback de erro de conexão amigável ao usuário. | Mensagens de erro |

## 5. Entidades de Dados (conceitual)
- **Usuário** (nome, e-mail, senha, tipo: aluno/personal, dados físicos).
- **Exercício** (catálogo: nome, grupo muscular, equipamento, dificuldade).
- **Treino** (nome, tipo, descrição, duração, dono).
- **TreinoExercício** (relação N:N treino↔exercício com séries/reps/carga/descanso/ordem).
- **HistóricoTreino** (execução: data, duração real, concluído, avaliação).

## 6. Fora de Escopo
- Cadastro de novos usuários pelo app (contas são pré-existentes em `db.json`).
- Recuperação de senha.
- Funcionalidades do perfil "personal" (gestão de alunos) — apenas login.
- Pagamentos, notificações push, integração com wearables.

## 7. Pontos em Aberto
- [RESOLVIDO 2026-06-22] Alvo dos testes E2E: **Expo Web**.
- [RESOLVIDO 2026-06-22] Tratamento de segurança: **somente relatório** OWASP
  nesta entrega (correções planejadas para iteração futura).
