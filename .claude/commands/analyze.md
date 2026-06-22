---
description: Verifica consistência e rastreabilidade entre spec, plan e tasks.
---

Você está no passo **/analyze** do processo Spec-Driven Development.

Faça (somente leitura — não altere arquivos sem confirmação):
1. Leia `spec.md`, `plan.md`, `tasks.md` e `constitution.md`.
2. Verifique:
   - Todo FR/NFR da spec tem tarefa correspondente em tasks.md? (Princípio II)
   - Toda tarefa rastreia até um requisito?
   - O plan respeita a Constituição?
   - Há requisitos sem cobertura de teste? (Princípio III)
3. Produza um relatório de inconsistências (lacunas, órfãos, conflitos)
   classificado por severidade. Sugira correções.
