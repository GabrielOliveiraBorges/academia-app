# 🏋️ FitApp - Mobile (React Native + Expo)

Aplicativo **mobile** de gerenciamento de treinos de academia, feito em **React Native** com **Expo Go**, consumindo um backend **json-server**.

## 📋 Stack

- **Frontend mobile:** React Native + Expo (SDK 52)
- **Linguagem:** JavaScript (`.jsx`)
- **Navegação:** React Navigation (Native Stack)
- **Sessão:** AsyncStorage
- **Backend:** json-server (lê e grava em `db.json`)

## 🗂️ Estrutura

```
academia-app/
├── App.jsx                       → Entry point + navegação
├── index.js                      → registerRootComponent
├── app.json                      → Config Expo
├── package.json
├── babel.config.js
├── db.json                       → Banco usado pelo json-server
├── src/
│   ├── api.jsx                   → Funções fetch para o backend
│   ├── AuthContext.jsx           → Sessão (AsyncStorage)
│   ├── styles.jsx                → Paleta de cores
│   └── screens/
│       ├── LoginScreen.jsx
│       ├── HomeScreen.jsx        → Dashboard + lista de treinos
│       ├── TreinoFormScreen.jsx  → Criar/editar treino
│       ├── DetalhesScreen.jsx    → Exercícios + concluir treino
│       └── ExercicioFormScreen.jsx
├── database/
│   └── schema.sql                → Modelagem SQL (referência)
└── web-legacy/                   → Versão web antiga (HTML/CSS/JS)
```

## 🚀 Como rodar

### Pré-requisitos

- **Node.js 18+** (testado com 24.x)
- **Expo Go** instalado no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- **PC e celular conectados ao MESMO Wi-Fi**

### 1. Instalar dependências (uma vez só)

```bash
npm install
```

### 2. Configurar o IP da sua máquina

Abra `src/api.jsx` e troque o IP pelo IPv4 da sua máquina:

```js
export const API_URL = 'http://192.168.100.10:3000';
```

Para descobrir seu IP no Windows: rode `ipconfig` no terminal e procure o **Endereço IPv4** (geralmente `192.168.x.x`).

> ⚠️ **Não use `localhost`** — o celular não enxerga `localhost` da sua máquina.

### 3. Iniciar o backend (em um terminal)

```bash
npm run api
```

Isso roda o json-server na porta 3000 ouvindo em todas as interfaces (`--host 0.0.0.0`), o que é necessário para o celular conseguir acessar.

### 4. Iniciar o Expo (em outro terminal)

```bash
npm start
```

Vai abrir um QR code no terminal. **Escaneie com o Expo Go** (Android) ou com a câmera (iOS) para abrir o app no celular.

### 5. Contas para teste

| E-mail | Senha | Tipo |
|---|---|---|
| joao@email.com | 123456 | aluno |
| maria@email.com | 123456 | aluno |
| carlos@email.com | 123456 | personal |

## 🎯 Funcionalidades com backend

1. **Login** — valida e-mail/senha consultando `/usuarios`
2. **Dashboard** — total de treinos, concluídos e último treino
3. **Listar treinos** — `GET /treinos?usuario_id={id}`
4. **Criar / Editar / Excluir treino** — `POST/PUT/DELETE /treinos`
5. **Ver detalhes do treino** — exercícios via `/treino_exercicios` + catálogo `/exercicios`
6. **Adicionar / Editar / Remover exercício** — `POST/PUT/DELETE /treino_exercicios`
7. **Concluir treino** — `POST /historico_treinos`

## 🐛 Problemas comuns

**"Erro ao conectar com o servidor" no login**
- Verifique se o `npm run api` está rodando.
- Confira se o IP em `src/api.jsx` é o IPv4 atual da sua máquina (`ipconfig`).
- Confirme que celular e PC estão no **mesmo Wi-Fi**.
- O firewall do Windows pode estar bloqueando a porta 3000 — libere ou desative temporariamente.

**Expo Go não abre o app**
- Reinicie o Expo: `Ctrl+C` no terminal e `npm start` de novo.
- No celular, no Expo Go, vá em "Enter URL manually" e cole a URL exibida no terminal (`exp://192.168.x.x:8081`).

## 🗄️ Modelo do Banco

Tabelas (ver `database/schema.sql`):
- `usuarios` (id, nome, email, senha, tipo, peso, altura, objetivo)
- `exercicios` (id, nome, grupo_muscular, equipamento, dificuldade)
- `treinos` (id, nome, tipo, duracao, usuario_id, personal_id)
- `treino_exercicios` (N:N entre treinos e exercicios, com séries/reps/carga)
- `historico_treinos` (registros de execução)

## 📌 Observações

- A autenticação é simplificada (sem hash de senha / JWT) por ser projeto acadêmico.
- A sessão é persistida com `AsyncStorage` (equivalente ao `localStorage` no celular).
