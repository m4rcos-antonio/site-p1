CREATE DATABASE IF NOT EXISTS barbearia_db;
USE barbearia_db;

-- =====================================================
-- TABELA: SERVIÇOS
-- =====================================================
CREATE TABLE IF NOT EXISTS servicos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  descricao TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABELA: AGENDAMENTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS agendamentos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  servico_id INT NOT NULL,
  data_agendamento DATE NOT NULL,
  hora_agendamento TIME NOT NULL,
  nome_cliente VARCHAR(150) NOT NULL,
  telefone_cliente VARCHAR(20) NOT NULL,
  email_cliente VARCHAR(150),
  status ENUM('confirmado', 'cancelado', 'concluido') DEFAULT 'confirmado',
  notas TEXT,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (servico_id) REFERENCES servicos(id),
  UNIQUE KEY unique_agendamento (data_agendamento, hora_agendamento),
  INDEX idx_data (data_agendamento),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERIR SERVIÇOS PADRÃO
-- =====================================================
INSERT INTO servicos (nome, preco, descricao) VALUES
('Corte Tradicional', 45.00, 'Corte clássico com acabamento profissional'),
('Barba', 35.00, 'Barba completa com tratamento'),
('Corte + Barba', 70.00, 'Pacote completo: corte e barba'),
('Acabamento', 25.00, 'Acabamento e aparagem');
