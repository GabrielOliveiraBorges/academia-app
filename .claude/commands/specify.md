---
description: Cria a especificação (spec.md) de uma nova funcionalidade a partir de uma descrição em linguagem natural.
---

Você está no passo **/specify** do processo Spec-Driven Development.

Entrada do usuário (descrição da feature): $ARGUMENTS

Faça:
1. Leia `.specify/memory/constitution.md` e respeite todos os princípios.
2. Determine o próximo número de feature olhando `specs/` (NNN incremental).
3. Crie `specs/NNN-nome-curto/spec.md` usando `.specify/templates/spec-template.md`.
4. Descreva **o quê** e **por quê** — nunca tecnologia.
5. Todo requisito deve ser testável e ter ID (FR-xxx / NFR-xxx).
6. Marque ambiguidades com `[NEEDS CLARIFICATION: pergunta]`.
7. Não escreva código. Ao final, informe o caminho do `spec.md` criado.
