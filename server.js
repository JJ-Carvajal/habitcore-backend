// backend/server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Redirección raíz
app.get('/', (req, res) => {
    res.redirect('/views/login.html');
});

// Rutas
const authRoutes = require('./routes/auth.routes');
const habitosRoutes = require('./routes/habitos.routes');
const progresoRoutes = require('./routes/progreso');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/habitos', habitosRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/admin', adminRoutes);

// TEST conexión DB
const db = require('./config/db'); // O el nombre que tenga tu carpeta

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ ok: true, message: 'DB funcionando' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});