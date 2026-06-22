---
description: Gera o plano técnico (plan.md) a partir de uma spec aprovada.
---

Você está no passo **/plan** do processo Spec-Driven Development.

Contexto/argumentos: $ARGUMENTS

Faça:
1. Leia a `spec.md` da feature atual e a `.specify/memory/constitution.md`.
2. Crie `plan.md` na mesma pasta usando `.specify/templates/plan-template.md`.
3. Preencha a tabela **Constitution Check**; se algum princípio for violado,
   pare e registre o motivo antes de continuar.
4. Defina arquitetura, contratos de API, modelo de dados físico e a
   estratégia de testes (como cada FR vira teste Playwright com print).
5. Não implemente código ainda. Informe o caminho do `plan.md`.
