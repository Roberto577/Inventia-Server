const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }, // Usa SSL si la base de datos lo requiere
});

console.log('DB_URL:', process.env.DB_URL);

pool.connect()
  .then(() => {
    console.log('Conectado a la base de datos con éxito');
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos', err);
  });

// pool.query('SELECT * FROM usuarios', (err, res) => {
//   if (err) {
//     console.error('Error ejecutando la consulta:', err);
//   } else {
//     console.log('Hora actual de la base de datos:', res.rows[0]);
//   }
// });

// console.log(pool);

module.exports = pool;