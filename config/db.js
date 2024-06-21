const { Pool } = require('pg');

const pool = new Pool({
  user: 'leopard',
  host: 'localhost',
  database: 'bank_loan',
  password: 'julio',
  port: 5432,
});

module.exports = pool;
