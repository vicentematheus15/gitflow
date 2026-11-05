-- Executado automaticamente pelo MySQL na primeira inicialização do volume.
-- O banco e o usuário da aplicação são criados pelas variáveis
-- MYSQL_DATABASE, MYSQL_USER e MYSQL_PASSWORD do docker-compose.yml.

CREATE TABLE IF NOT EXISTS tarefas (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  descricao VARCHAR(255) NOT NULL,
  concluida BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id)
);
