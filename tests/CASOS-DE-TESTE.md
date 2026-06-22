# Casos de Teste — FitApp (Playwright / Expo Web)

**Desenvolvedor (Aluno):** Gabriel Oliveira Borges
**Ferramenta:** Playwright (`@playwright/test`)
**Alvo:** Expo Web (`http://localhost:8081`) + json-server (`http://localhost:3000`)
**Total de casos:** 13 (mínimo exigido: 10) — **todos aprovados ✅**
**Evidências (prints):** [`tests/evidencias/`](evidencias/)

> Cada caso de teste captura ao menos uma evidência de print durante a execução.
> O mapeamento abaixo liga cada caso ao requisito (FR) da especificação em
> [`specs/001-fitapp-gerenciamento-treinos/spec.md`](../specs/001-fitapp-gerenciamento-treinos/spec.md).

## Como executar

```bash
# 1. instalar dependências (uma vez)
npm install
npx playwright install chromium

# 2. rodar os testes (sobe json-server e Expo Web automaticamente)
npm test

# 3. abrir o relatório HTML
npm run test:report
```

> O `playwright.config.js` inicia automaticamente o backend e o Expo Web via
> `webServer`. As evidências são salvas em `tests/evidencias/`.

## Tabela de Casos de Teste

| # | Caso de Teste | Requisito | Arquivo | Evidência | Status |
|---|---------------|-----------|---------|-----------|--------|
| TC-01 | Tela de login é exibida com seus elementos | base | `01-autenticacao.spec.js` | `TC-01-tela-login.png` | ✅ |
| TC-02 | Login com e-mail não cadastrado exibe erro | FR-002 | `01-autenticacao.spec.js` | `TC-02-email-nao-cadastrado.png` | ✅ |
| TC-03 | Login com senha incorreta exibe erro | FR-002 | `01-autenticacao.spec.js` | `TC-03-senha-incorreta.png` | ✅ |
| TC-04 | Login com sucesso leva ao painel | FR-001 | `01-autenticacao.spec.js` | `TC-04-login-sucesso.png` | ✅ |
| TC-05 | Painel exibe estatísticas (Total/Concluídos/Último) | FR-004 | `02-treinos.spec.js` | `TC-05-painel-estatisticas.png` | ✅ |
| TC-06 | Lista exibe os treinos do usuário logado | FR-005 | `02-treinos.spec.js` | `TC-06-lista-treinos.png` | ✅ |
| TC-07 | Criar um novo treino | FR-006 | `02-treinos.spec.js` | `TC-07-formulario-preenchido.png`, `TC-07-treino-criado.png` | ✅ |
| TC-08 | Validação: nome e tipo obrigatórios | FR-007 | `02-treinos.spec.js` | `TC-08-validacao-campos-obrigatorios.png` | ✅ |
| TC-09 | Editar um treino existente | FR-008 | `02-treinos.spec.js` | `TC-09-editando-treino.png`, `TC-09-treino-editado.png` | ✅ |
| TC-10 | Sessão persiste após recarregar a página | FR-003 | `01-autenticacao.spec.js` | `TC-10-sessao-persistente.png` | ✅ |
| TC-11 | Abrir os detalhes de um treino | FR-010 | `03-detalhes-navegacao.spec.js` | `TC-11-detalhes-treino.png` | ✅ |
| TC-12 | Abrir o formulário de adicionar exercício | FR-011 | `03-detalhes-navegacao.spec.js` | `TC-12-form-exercicio.png` | ✅ |
| TC-13 | Cancelar a criação de treino volta ao painel | nav. | `03-detalhes-navegacao.spec.js` | `TC-13-cancelar-volta-painel.png` | ✅ |

## Observações técnicas

- Os casos **TC-07** e **TC-09** alteram dados e fazem **limpeza automática**
  (removem o treino de teste / restauram o treino editado via API), mantendo o
  `db.json` estável após a execução.
- Diálogos nativos `Alert.alert` do React Native **não** renderizam no DOM
  quando rodando em Expo Web; por isso fluxos baseados em confirmação por Alert
  (excluir, concluir, sair) são validados em ambiente mobile e não fazem parte
  destes casos web. Isto está registrado no `plan.md` (decisão de projeto).
- Viewport de teste em proporção mobile (420×900) para refletir o uso real.
