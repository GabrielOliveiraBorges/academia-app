# 🏋️ FitApp - Sistema de Gerenciamento de Treino

Projeto acadêmico de um aplicativo web para gerenciar treinos de academia.

## 📋 Requisitos atendidos

- ✅ Modelagem das tabelas do banco (`database/schema.sql`)
- ✅ Frontend de Login (`index.html`)
- ✅ Backend Login com json-server (autenticação via `/usuarios`)
- ✅ Tela Home inicial (`home.html`) com dashboard e estatísticas
- ✅ Backend da Home com json-server (carrega treinos e histórico)
- ✅ **Função funcional com backend:** CRUD completo de treinos (criar, listar, editar, excluir) + registro de treinos concluídos

## 🗂️ Estrutura do projeto

```
academia-app/
├── index.html          → Tela de login
├── home.html           → Tela inicial (dashboard)
├── db.json             → Banco de dados do json-server
├── css/
│   └── style.css       → Estilização do app
├── js/
│   ├── login.js        → Autenticação (consome API)
│   └── home.js         → Dashboard + CRUD de treinos
├── database/
│   └── schema.sql      → Modelagem SQL (MySQL)
└── README.md
```

## 🗄️ Modelo do Banco de Dados

### Tabelas

| Tabela | Descrição |
|---|---|
| `usuarios` | Alunos e personal trainers (id, nome, email, senha, tipo, peso, altura, objetivo) |
| `exercicios` | Catálogo de exercícios (id, nome, grupo_muscular, equipamento, dificuldade) |
| `treinos` | Treinos dos alunos (id, nome, tipo, duracao, usuario_id, personal_id) |
| `treino_exercicios` | Relação N:N entre treinos e exercícios com séries/reps/carga |
| `historico_treinos` | Registro de treinos executados (usuario_id, treino_id, data, duracao_real, avaliacao) |

### Relacionamentos

- `usuarios (1) ←→ (N) treinos` — um aluno tem vários treinos
- `treinos (N) ←→ (N) exercicios` — via `treino_exercicios`
- `usuarios (1) ←→ (N) historico_treinos` — histórico de execução

## 🚀 Como rodar

### 1. Instalar o json-server (uma vez só)

```bash
npm install -g json-server
```

### 2. Iniciar o servidor (backend)

Na pasta do projeto:

```bash
json-server --watch db.json --port 3000
```

O backend estará rodando em `http://localhost:3000`. Endpoints disponíveis:

- `GET/POST/PUT/DELETE http://localhost:3000/usuarios`
- `GET/POST/PUT/DELETE http://localhost:3000/treinos`
- `GET/POST/PUT/DELETE http://localhost:3000/exercicios`
- `GET/POST/PUT/DELETE http://localhost:3000/treino_exercicios`
- `GET/POST/PUT/DELETE http://localhost:3000/historico_treinos`

### 3. Abrir o frontend

Abra o arquivo `index.html` no navegador (duplo clique) ou use a extensão **Live Server** do VS Code.

### 4. Contas para teste

| E-mail | Senha | Tipo |
|---|---|---|
| joao@email.com | 123456 | aluno |
| maria@email.com | 123456 | aluno |
| carlos@email.com | 123456 | personal |

## 🎯 Funcionalidades com backend

1. **Login** — valida e-mail/senha consultando `/usuarios` no json-server
2. **Dashboard** — carrega estatísticas (total de treinos, concluídos, último treino) de `/treinos` e `/historico_treinos`
3. **Listar treinos** — GET em `/treinos?usuario_id={id}`
4. **Criar treino** — POST em `/treinos`
5. **Editar treino** — PUT em `/treinos/{id}`
6. **Excluir treino** — DELETE em `/treinos/{id}`
7. **Ver detalhes** — GET em `/treino_exercicios?treino_id={id}` + `/exercicios`
8. **Concluir treino** — POST em `/historico_treinos`

## 📌 Observações

- A autenticação é simplificada (sem criptografia de senha / JWT) por ser um projeto acadêmico.
- A sessão do usuário é armazenada em `localStorage`.
- Em produção, o recomendado seria usar hash de senha (bcrypt) e tokens JWT.
