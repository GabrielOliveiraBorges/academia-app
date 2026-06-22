# Relatório de Segurança — OWASP Top 10 (2021)

**Projeto:** FitApp — Gerenciamento de Treinos (React Native + Expo + json-server)
**Responsável:** Gabriel Oliveira Borges
**Data da análise:** 2026-06-22
**Escopo:** App mobile/web (`src/`), backend mock (`json-server` + `db.json`),
versão web legada (`web-legacy/`).

> Este relatório avalia o projeto contra o **OWASP Top 10 (2021)**, indicando
> para cada categoria se o risco foi **Resolvido**, **Não resolvido**,
> **Parcialmente mitigado** ou **Não aplicável**, com a evidência no código e a
> recomendação de correção.
>
> ⚠️ **Contexto acadêmico:** o FitApp é didático e adota, por decisão de
> projeto (ver Constituição, Princípio V), uma autenticação simplificada. As
> fragilidades abaixo são **conhecidas e documentadas**, não escondidas.

---

## Resumo Executivo

| Status | Quantidade | Itens |
|--------|-----------|-------|
| 🔴 Não resolvido | 6 | A01, A02, A04, A05, A06, A07 |
| 🟡 Parcialmente mitigado | 2 | A03, A08 |
| 🔵 Não aplicável | 1 | A10 |
| 🟠 Não resolvido (sem monitoramento) | 1 | A09 |
| 🟢 Resolvido | 0 | — |

**Nível de risco geral:** **ALTO** para uso em produção; **aceitável** apenas
em ambiente acadêmico/local controlado. O principal vetor é o backend
`json-server`, que **não possui autenticação nem autorização** e trafega dados
sensíveis (inclusive senhas em texto puro) por HTTP.

---

## Análise Detalhada

### A01:2021 — Broken Access Control (Quebra de Controle de Acesso)
- **Status:** 🔴 **Não resolvido**
- **Como se aplica:** O `json-server` expõe todos os recursos
  (`/usuarios`, `/treinos`, `/treino_exercicios`, `/historico_treinos`) sem
  qualquer verificação de acesso. Qualquer cliente pode ler, alterar ou excluir
  treinos de **qualquer** usuário. A separação "cada aluno vê só os seus
  treinos" é feita **apenas no cliente**, filtrando em JavaScript.
- **Evidência:** [`src/screens/HomeScreen.jsx:58`](../src/screens/HomeScreen.jsx#L58)
  (`todosTreinos.filter(t => String(t.usuario_id) === String(usuario.id))`) e
  [`src/api.jsx`](../src/api.jsx) (chamadas sem token/autorização).
- **Recomendação:** Mover a autorização para o servidor (backend real com
  middleware de auth), validando o dono do recurso em cada requisição.

### A02:2021 — Cryptographic Failures (Falhas Criptográficas)
- **Status:** 🔴 **Não resolvido**
- **Como se aplica:** Senhas são armazenadas em **texto puro** no `db.json`,
  retornadas pela API em `GET /usuarios` e comparadas no cliente. O tráfego é
  **HTTP** (sem TLS).
- **Evidência:** [`db.json:8`](../db.json#L8) (`"senha": "123456"`),
  [`src/screens/LoginScreen.jsx:38`](../src/screens/LoginScreen.jsx#L38)
  (`if (usuario.senha !== senha)`), [`src/api.jsx`](../src/api.jsx) (`http://`).
- **Recomendação:** Nunca trafegar/armazenar senha em texto puro; usar hash
  forte (bcrypt/argon2) no servidor, HTTPS, e nunca retornar o campo `senha`.

### A03:2021 — Injection (Injeção)
- **Status:** 🟡 **Parcialmente mitigado**
- **Como se aplica:** Não há banco SQL em runtime (o `schema.sql` é apenas
  referência); o json-server usa um JSON. O parâmetro de e-mail é codificado
  com `encodeURIComponent`. Componentes `Text` do React Native não interpretam
  HTML, o que reduz risco de XSS no app. Ponto de atenção: a versão
  `web-legacy/` manipula DOM e deve ser auditada se for usada.
- **Evidência:** [`src/api.jsx:20`](../src/api.jsx#L20)
  (`encodeURIComponent(email)`); ausência de SQL dinâmico.
- **Recomendação:** Manter parametrização; se adotar backend SQL, usar queries
  parametrizadas/ORM; sanitizar qualquer render de HTML na versão web.

### A04:2021 — Insecure Design (Design Inseguro)
- **Status:** 🔴 **Não resolvido** (por decisão de projeto)
- **Como se aplica:** O modelo de autenticação foi simplificado de propósito:
  sem política de senha, sem expiração de sessão, sem proteção contra força
  bruta, sem rate limiting.
- **Evidência:** Fluxo de login em
  [`src/screens/LoginScreen.jsx`](../src/screens/LoginScreen.jsx) e sessão em
  [`src/AuthContext.jsx`](../src/AuthContext.jsx).
- **Recomendação:** Em evolução do projeto, modelar requisitos de segurança
  desde o design (threat modeling), com tokens de sessão e expiração.

### A05:2021 — Security Misconfiguration (Configuração Insegura)
- **Status:** 🔴 **Não resolvido**
- **Como se aplica:** O backend roda com `--host 0.0.0.0`, expondo a API a toda
  a rede local, sem CORS restritivo, sem autenticação e com dados reais.
- **Evidência:** [`package.json`](../package.json) script `api`
  (`json-server --host 0.0.0.0`).
- **Recomendação:** Restringir host/porta, configurar CORS, separar ambientes e
  remover dados sensíveis de bases de exemplo.

### A06:2021 — Vulnerable and Outdated Components (Componentes Vulneráveis)
- **Status:** 🔴 **Não resolvido**
- **Como se aplica:** O `npm audit` na data da análise reportou
  **23 vulnerabilidades (1 baixa, 19 moderadas, 2 altas, 1 crítica)** nas
  dependências (incluindo cadeia do `json-server`).
- **Evidência:** Saída de `npm audit` (executar para detalhes).
- **Recomendação:** Rodar `npm audit fix`, atualizar/fixar versões, substituir o
  `json-server` por backend mantido em produção e monitorar dependências
  (ex.: Dependabot).

### A07:2021 — Identification and Authentication Failures
- **Status:** 🔴 **Não resolvido**
- **Como se aplica:** Autenticação por comparação de senha em texto puro, sem
  token/JWT, sem expiração; a sessão é gravada **sem criptografia** no
  AsyncStorage/localStorage; não há bloqueio após tentativas falhas.
- **Evidência:** [`src/AuthContext.jsx:20`](../src/AuthContext.jsx#L20)
  (`AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosUsuario))`),
  [`src/screens/LoginScreen.jsx:38`](../src/screens/LoginScreen.jsx#L38).
- **Recomendação:** Autenticação baseada em token com expiração/refresh,
  armazenamento seguro (SecureStore/Keychain), política de senha e proteção
  contra força bruta.

### A08:2021 — Software and Data Integrity Failures
- **Status:** 🟡 **Parcialmente mitigado**
- **Como se aplica:** Há `package-lock.json` fixando versões (bom para
  integridade de build). Não há verificação de integridade adicional e o
  conteúdo é servido por HTTP (sujeito a adulteração na rede).
- **Evidência:** [`package-lock.json`](../package-lock.json) presente.
- **Recomendação:** Usar HTTPS, validar integridade de artefatos e assinaturas,
  pipelines de build confiáveis.

### A09:2021 — Security Logging and Monitoring Failures
- **Status:** 🟠 **Não resolvido**
- **Como se aplica:** Não há registro de eventos de segurança (logins,
  alterações, falhas) nem monitoramento/alertas. Falhas de login só aparecem na
  UI do cliente.
- **Evidência:** Ausência de camada de logging no `src/` e no backend mock.
- **Recomendação:** Registrar tentativas de login e operações sensíveis no
  servidor, com monitoramento e retenção de logs.

### A10:2021 — Server-Side Request Forgery (SSRF)
- **Status:** 🔵 **Não aplicável**
- **Como se aplica:** O app não recebe URLs do usuário para o servidor buscar;
  todas as requisições têm destino fixo (`API_URL`). Não há superfície de SSRF.
- **Evidência:** [`src/api.jsx`](../src/api.jsx) (destino fixo/derivado do host).
- **Recomendação:** Caso futuramente o backend faça requisições a URLs
  fornecidas pelo usuário, aplicar allowlist e validação.

---

## Plano de Correção Sugerido (priorizado)

| Prioridade | Ação | Itens OWASP |
|------------|------|-------------|
| 1 (Crítica) | Backend real com autenticação/autorização (token + dono do recurso) | A01, A04, A05, A07 |
| 2 (Alta) | Hash de senha (bcrypt/argon2) + HTTPS + não expor `senha` na API | A02, A07 |
| 3 (Alta) | `npm audit fix` e atualização de dependências | A06 |
| 4 (Média) | Armazenamento seguro de sessão (SecureStore) com expiração | A07 |
| 5 (Média) | Logging e monitoramento de eventos de segurança | A09 |
| 6 (Baixa) | CORS restritivo e hardening de configuração | A05 |

> **Conclusão:** nesta entrega o objetivo foi **identificar e documentar** o
> estado de segurança conforme o padrão OWASP. As correções estão planejadas e
> priorizadas acima para uma futura iteração que leve o projeto a um cenário de
> produção.
