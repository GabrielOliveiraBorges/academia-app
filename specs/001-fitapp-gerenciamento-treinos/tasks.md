# Tarefas — Gerenciamento de Treinos (FitApp)

**Plano de origem:** `specs/001-fitapp-gerenciamento-treinos/plan.md`
**Criado em:** 2026-06-22

> `[P]` = paralelizável. Status: ✅ concluído · ☐ pendente.

## Lista de Tarefas

| ID | Tarefa | Requisito | Paralelo | Status |
|----|--------|-----------|----------|--------|
| T001 | Tela de login com validação de e-mail/senha | FR-001, FR-002 | | ✅ |
| T002 | Sessão persistida (AuthContext + AsyncStorage) | FR-003 | | ✅ |
| T003 | Painel com estatísticas (total/concluídos/último) | FR-004 | | ✅ |
| T004 | Listagem de treinos do usuário logado | FR-005 | | ✅ |
| T005 | Formulário de criação de treino + validação | FR-006, FR-007 | | ✅ |
| T006 | Edição de treino | FR-008 | | ✅ |
| T007 | Exclusão de treino (com exercícios) | FR-009 | | ✅ |
| T008 | Tela de detalhes do treino | FR-010 | | ✅ |
| T009 | CRUD de exercícios do treino | FR-011 | | ✅ |
| T010 | Concluir treino (grava histórico) | FR-012 | | ✅ |
| T011 | Logout | FR-013 | | ✅ |
| T012 | `API_URL` detecta web e usa localhost | D2 (plan) | | ✅ |
| T013 | Configurar Playwright + webServer (Expo Web + json-server) | NFR-002 | | ✅ |
| T014 | Escrever 10+ casos de teste E2E com print | NFR-002 | [P] | ✅ |
| T015 | Gerar evidências de print em `tests/evidencias/` | NFR-002 | | ✅ |
| T016 | Relatório de segurança OWASP Top 10 | NFR-001 | [P] | ✅ |
| T017 | Documentar mapeamento teste→requisito | II (constituição) | [P] | ✅ |

## Matriz de Rastreabilidade (Requisito → Teste)

| Requisito | Caso(s) de Teste Playwright |
|-----------|------------------------------|
| FR-001 | TC-04 (login sucesso) |
| FR-002 | TC-02 (e-mail inexistente), TC-03 (senha incorreta) |
| FR-003 | TC-10 (persistência de sessão) |
| FR-004 | TC-05 (estatísticas do painel) |
| FR-005 | TC-06 (lista de treinos) |
| FR-006 | TC-07 (criar treino) |
| FR-007 | TC-08 (validação nome/tipo) |
| FR-008 | TC-09 (editar treino) |
| FR-010 | TC-11 (detalhes do treino) |
| FR-011 | TC-12 (abrir form de exercício) |
| outros | TC-01 (render login), TC-13 (logout fluxo web) |

## Critério de Pronto (Definition of Done)
- [x] Código implementado conforme o plano.
- [x] 10+ testes Playwright cobrindo os requisitos.
- [x] Evidências de print salvas em `tests/evidencias/`.
- [x] Relatório OWASP entregue.
- [x] Conformidade com a Constituição revisada.
