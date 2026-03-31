// backend/db.js
const mysql = require('mysql2');
require('dotenv').config({ override: true });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
    ssl: {
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Verificación de conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error en la base de datos:', err.message);
    } else {
        console.log('✅ Conectado a MySQL en Aiven');
        connection.release();
    }
});

module.exports = promisePool;