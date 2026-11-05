const mysql = require("mysql2/promise");

// A conexão é configurada por variáveis de ambiente. Dentro do Docker Compose,
// DB_HOST é o nome do serviço do banco ("db"), resolvido pela rede do Compose.
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "app_user",
  password: process.env.DB_PASSWORD || "app_password",
  database: process.env.DB_NAME || "app_db",
  waitForConnections: true,
  connectionLimit: 10
});

module.exports = db;
