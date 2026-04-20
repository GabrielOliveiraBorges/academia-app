# 📊 Modelo Entidade-Relacionamento (MER)

## Diagrama ER

```mermaid
erDiagram
    USUARIOS ||--o{ TREINOS : possui
    USUARIOS ||--o{ TREINOS : treina
    USUARIOS ||--o{ HISTORICO_TREINOS : executa
    TREINOS ||--o{ TREINO_EXERCICIOS : contem
    EXERCICIOS ||--o{ TREINO_EXERCICIOS : aparece_em
    TREINOS ||--o{ HISTORICO_TREINOS : registrado_em

    USUARIOS {
        int id PK
        string nome
        string email UK
        string senha
        enum tipo "aluno|personal"
        date data_nascimento
        decimal peso
        decimal altura
        string objetivo
        datetime data_cadastro
        boolean ativo
    }

    EXERCICIOS {
        int id PK
        string nome
        string grupo_muscular
        text descricao
        string equipamento
        string video_url
        enum dificuldade
    }

    TREINOS {
        int id PK
        string nome
        text descricao
        int usuario_id FK
        int personal_id FK
        string tipo
        int duracao_minutos
        datetime data_criacao
        boolean ativo
    }

    TREINO_EXERCICIOS {
        int id PK
        int treino_id FK
        int exercicio_id FK
        int series
        string repeticoes
        decimal carga_kg
        int descanso_seg
        int ordem
        text observacao
    }

    HISTORICO_TREINOS {
        int id PK
        int usuario_id FK
        int treino_id FK
        datetime data_execucao
        int duracao_real
        boolean concluido
        text observacoes
        int avaliacao
    }
```

## Descrição dos relacionamentos

1. **USUARIOS → TREINOS (1:N)** — Cada aluno pode ter vários treinos cadastrados. Um personal pode criar treinos para vários alunos.

2. **TREINOS ↔ EXERCICIOS (N:N)** — Um treino possui vários exercícios, e um mesmo exercício aparece em vários treinos. A tabela associativa `TREINO_EXERCICIOS` guarda as informações específicas (séries, repetições, carga, tempo de descanso).

3. **USUARIOS → HISTORICO_TREINOS (1:N)** — Cada usuário tem vários registros de treinos executados ao longo do tempo.

4. **TREINOS → HISTORICO_TREINOS (1:N)** — Um treino pode ter sido executado várias vezes, cada execução gerando um registro no histórico.

## Chaves

- **PK** (Primary Key): chave primária de cada tabela
- **FK** (Foreign Key): chave estrangeira que referencia outra tabela
- **UK** (Unique Key): campo único (e-mail do usuário não pode repetir)
