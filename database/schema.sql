CREATE DATABASE IF NOT EXISTS fitapp;
USE fitapp;

CREATE TABLE usuarios (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    senha           VARCHAR(255) NOT NULL,
    tipo            ENUM('aluno', 'personal') NOT NULL DEFAULT 'aluno',
    data_nascimento DATE,
    peso            DECIMAL(5,2),
    altura          DECIMAL(3,2),
    objetivo        VARCHAR(200),
    foto_perfil     VARCHAR(255),
    data_cadastro   DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo           BOOLEAN DEFAULT TRUE
);

CREATE TABLE exercicios (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    grupo_muscular  VARCHAR(50) NOT NULL,
    descricao       TEXT,
    equipamento     VARCHAR(100),
    video_url       VARCHAR(255),
    dificuldade     ENUM('iniciante', 'intermediario', 'avancado') DEFAULT 'iniciante'
);

CREATE TABLE treinos (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    nome            VARCHAR(100) NOT NULL,
    descricao       TEXT,
    usuario_id      INT NOT NULL,
    personal_id     INT,
    tipo            VARCHAR(50), 
    duracao_minutos INT,
    data_criacao    DATETIME DEFAULT CURRENT_TIMESTAMP,
    ativo           BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (personal_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE TABLE treino_exercicios (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    treino_id       INT NOT NULL,
    exercicio_id    INT NOT NULL,
    series          INT NOT NULL,
    repeticoes      VARCHAR(20) NOT NULL, 
    carga_kg        DECIMAL(5,2),
    descanso_seg    INT DEFAULT 60,
    ordem           INT NOT NULL,
    observacao      TEXT,
    FOREIGN KEY (treino_id) REFERENCES treinos(id) ON DELETE CASCADE,
    FOREIGN KEY (exercicio_id) REFERENCES exercicios(id) ON DELETE CASCADE
);

CREATE TABLE historico_treinos (
    id              INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id      INT NOT NULL,
    treino_id       INT NOT NULL,
    data_execucao   DATETIME DEFAULT CURRENT_TIMESTAMP,
    duracao_real    INT, 
    concluido       BOOLEAN DEFAULT FALSE,
    observacoes     TEXT,
    avaliacao       INT CHECK (avaliacao BETWEEN 1 AND 5),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (treino_id) REFERENCES treinos(id) ON DELETE CASCADE
);


INSERT INTO usuarios (nome, email, senha, tipo, peso, altura, objetivo) VALUES
('João Silva', 'joao@email.com', '123456', 'aluno', 78.5, 1.75, 'Hipertrofia'),
('Maria Souza', 'maria@email.com', '123456', 'aluno', 62.0, 1.65, 'Emagrecimento'),
('Carlos Personal', 'carlos@email.com', '123456', 'personal', 85.0, 1.80, 'Instrutor');

INSERT INTO exercicios (nome, grupo_muscular, equipamento, dificuldade) VALUES
('Supino Reto', 'Peito', 'Barra e Banco', 'intermediario'),
('Agachamento Livre', 'Pernas', 'Barra', 'avancado'),
('Rosca Direta', 'Bíceps', 'Halteres', 'iniciante'),
('Puxada Frente', 'Costas', 'Polia Alta', 'iniciante'),
('Desenvolvimento', 'Ombros', 'Halteres', 'intermediario'),
('Leg Press 45°', 'Pernas', 'Leg Press', 'iniciante'),
('Tríceps Corda', 'Tríceps', 'Polia', 'iniciante'),
('Remada Curvada', 'Costas', 'Barra', 'intermediario');

INSERT INTO treinos (nome, descricao, usuario_id, personal_id, tipo, duracao_minutos) VALUES
('Treino A - Peito e Tríceps', 'Foco em hipertrofia de peito', 1, 3, 'Peito/Tríceps', 60),
('Treino B - Costas e Bíceps', 'Puxadas e rosca', 1, 3, 'Costas/Bíceps', 55),
('Treino C - Pernas', 'Quadríceps e posterior', 1, 3, 'Pernas', 70);

INSERT INTO treino_exercicios (treino_id, exercicio_id, series, repeticoes, carga_kg, descanso_seg, ordem) VALUES
(1, 1, 4, '10-12', 60.0, 90, 1),
(1, 7, 3, '12-15', 20.0, 60, 2),
(2, 4, 4, '10-12', 50.0, 90, 1),
(2, 8, 3, '10', 40.0, 90, 2),
(2, 3, 3, '12', 14.0, 60, 3),
(3, 2, 4, '8-10', 80.0, 120, 1),
(3, 6, 3, '12', 150.0, 90, 2);
