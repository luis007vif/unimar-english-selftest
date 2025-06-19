const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",                 // ← o el usuario que elegiste
  host: "localhost",
  database: "english_test_unimar", // ← el nombre que creaste
  password: "Europa*22",       // ← la que usaste al instalar
  port: 5432,
});

module.exports = pool;
