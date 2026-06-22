# Plano Técnico — Gerenciamento de Treinos (FitApp)

**Spec de origem:** `specs/001-fitapp-gerenciamento-treinos/spec.md`
**Criado em:** 2026-06-22

## 1. Contexto Técnico
- **Stack:** React Native + Expo (SDK 54), JavaScript `.jsx`.
- **Navegação:** React Navigation (Native Stack).
- **Estado de sessão:** AsyncStorage via `AuthContext`.
- **Backend:** json-server (REST mock) sobre `db.json`, porta 3000.
- **Alvo de testes:** Expo Web (React Native Web), porta 8081.
- **Dependências novas:** `@playwright/test` (devDependency).

## 2. Verificação de Constituição (Constitution Check)

| Princípio | Conforme? | Observação |
|-----------|-----------|------------|
| I. Spec-First | ✅ | Spec retroativa criada antes de novas mudanças. |
| II. Rastreabilidade | ✅ | Matriz FR→Tarefa→Teste em `tasks.md`. |
| III. Test-Backed | ✅ | 10+ testes Playwright com print (NFR-002). |
| IV. Security by Design | ⚠️ | OWASP avaliado; nesta entrega, somente relatório (ver spec §7). |
| V. Simplicidade | ✅ | Sem JWT/hash nesta versão (decisão registrada). |

## 3. Arquitetura da Solução
```
App.jsx (NavigationContainer + AuthProvider)
 └─ Rotas (Stack)
     ├─ LoginScreen        → FR-001, FR-002
     ├─ HomeScreen         → FR-003, FR-004, FR-005, FR-009, FR-013
     ├─ TreinoFormScreen   → FR-006, FR-007, FR-008
     ├─ DetalhesScreen     → FR-010, FR-012
     └─ ExercicioFormScreen→ FR-011
src/api.jsx  → camada de acesso REST (fetch)
src/AuthContext.jsx → sessão persistida
```
Fluxo de dados: telas → `api.jsx` → json-server → `db.json`.

## 4. Contratos de API (json-server)
| Método | Rota | Uso | FR |
|--------|------|-----|----|
| GET | `/usuarios?email=` | login | FR-001 |
| GET | `/treinos` | listar treinos | FR-005 |
| GET | `/treinos/:id` | obter treino | FR-008, FR-010 |
| POST | `/treinos` | criar | FR-006 |
| PUT | `/treinos/:id` | editar | FR-008 |
| DELETE | `/treinos/:id` | excluir | FR-009 |
| GET/POST/PUT/DELETE | `/treino_exercicios` | exercícios do treino | FR-011 |
| GET | `/exercicios` | catálogo | FR-011 |
| GET/POST | `/historico_treinos` | histórico/conclusão | FR-004, FR-012 |

## 5. Modelo de Dados (físico)
Ver `database/schema.sql` e `database/modelo-er.md`. Coleções em `db.json`:
`usuarios`, `exercicios`, `treinos`, `treino_exercicios`, `historico_treinos`.

## 6. Estratégia de Testes
- Testes E2E com Playwright contra Expo Web (`http://localhost:8081`), com o
  json-server ativo (`http://localhost:3000`).
- `playwright.config.js` sobe ambos os servidores via `webServer`.
- Cada teste captura screenshot em `tests/evidencias/` (print obrigatório).
- Mapeamento teste→requisito documentado em `tests/CASOS-DE-TESTE.md`.
- Observação técnica: diálogos nativos `Alert.alert` do React Native **não**
  renderizam DOM no Expo Web; os testes focam fluxos verificáveis na web
  (login, painel, navegação, criação/edição via API, persistência de sessão).

## 7. Riscos e Decisões
- **D1:** Sem hash de senha/JWT — decisão didática (Princípio V); risco
  documentado no relatório OWASP (A02/A07).
- **D2:** `API_URL` passa a detectar a web e usar `localhost` automaticamente,
  para que o app web fale com o json-server local sem editar IP.
- **R1:** Bundle inicial do Expo Web é lento; testes usam timeouts folgados.
