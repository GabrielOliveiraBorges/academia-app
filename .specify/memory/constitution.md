# Constituição do Projeto — FitApp

> Documento base do processo de **Spec-Driven Development (SDD)**.
> Define os princípios inegociáveis que governam toda especificação, plano,
> tarefa e implementação do projeto. Em caso de conflito, esta constituição
> prevalece sobre qualquer `spec.md`, `plan.md` ou `tasks.md`.

- **Versão:** 1.0.0
- **Ratificada em:** 2026-06-22
- **Última emenda:** 2026-06-22

---

## Princípios Fundamentais

### I. Especificação antes do código (Spec-First)
Nenhuma funcionalidade é implementada sem uma especificação aprovada
(`spec.md`). A especificação descreve **o quê** e **por quê** (requisitos e
valor para o usuário), nunca **como** (tecnologia). Mudanças de comportamento
exigem atualização da spec antes do código.

### II. Rastreabilidade (Traceability)
Todo requisito funcional (FR) deve ser rastreável até uma tarefa (`tasks.md`)
e até um caso de teste. Todo caso de teste deve referenciar o requisito que
valida. Nada de código órfão; nada de teste sem requisito.

### III. Qualidade verificável por testes (Test-Backed)
Cada funcionalidade entregue na versão final possui evidência de teste
automatizado **Playwright** com captura de tela (print). Mínimo de **10 casos
de teste** por desenvolvedor. Um requisito só é considerado "Concluído" quando
existe um teste verde que o cobre.

### IV. Segurança como requisito (Security by Design)
A segurança é tratada como requisito de primeira classe, avaliada contra o
padrão **OWASP Top 10**. Cada release documenta o status de cada item OWASP
aplicável (Resolvido / Não resolvido / Não aplicável) em
`docs/SECURITY-OWASP.md`.

### V. Simplicidade e contexto acadêmico (Simplicity)
O projeto é didático. Prefere-se a solução mais simples que satisfaça o
requisito. Complexidade adicional (JWT, hashing, criptografia, CI/CD) só é
introduzida quando justificada na spec e registrada como decisão de projeto.
Limitações conhecidas são documentadas, nunca escondidas.

---

## Restrições Tecnológicas (Stack)

- **Frontend:** React Native + Expo (SDK 54), JavaScript (`.jsx`).
- **Web/Testes:** Expo Web (React Native Web) como alvo dos testes Playwright.
- **Backend:** json-server (mock REST) lendo/gravando em `db.json`.
- **Sessão:** AsyncStorage (equivalente a localStorage na web).
- **Testes E2E:** Playwright (`@playwright/test`).

Trocas de stack exigem emenda a esta constituição.

---

## Fluxo de Trabalho SDD

O ciclo de desenvolvimento segue os comandos definidos em `.claude/commands/`:

1. `/constitution` — cria/atualiza este documento.
2. `/specify` — gera a especificação (`spec.md`) a partir de uma descrição.
3. `/clarify` — resolve ambiguidades marcadas como `[NEEDS CLARIFICATION]`.
4. `/plan` — produz o plano técnico (`plan.md`).
5. `/tasks` — quebra o plano em tarefas executáveis (`tasks.md`).
6. `/analyze` — checa consistência entre spec, plan e tasks.
7. `/implement` — executa as tarefas, sempre com testes.

Cada feature vive em `specs/NNN-nome-da-feature/`.

---

## Governança

- Esta constituição **supera** as demais práticas do projeto.
- Emendas exigem: (a) justificativa registrada, (b) incremento de versão
  (SemVer: MAJOR = remoção/redefinição de princípio; MINOR = novo princípio;
  PATCH = ajuste textual) e (c) atualização da data de emenda.
- Todo PR/entrega deve poder ser verificado contra os princípios acima.
- Revisão de conformidade obrigatória antes de cada entrega no GitHub.
