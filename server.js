// backend/server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS ---
// Ahora que 'frontend' está dentro de 'backend', usamos path.join sin los puntos '..'
app.use(express.static(path.join(__dirname, 'frontend')));

// --- REDIRECCIÓN RAÍZ ---
// Importante: La ruta debe coincidir con la estructura interna de tu carpeta frontend
app.get('/', (req, res) => {
    // Al usar express.static en 'frontend', para el navegador la carpeta raíz es esa.
    // Por eso intentamos entrar directo a /views/
    res.redirect('/views/login.html');
});

// Rutas de la API
const authRoutes = require('./routes/auth.routes');
const habitosRoutes = require('./routes/habitos.routes');
const progresoRoutes = require('./routes/progreso');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/habitos', habitosRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/admin', adminRoutes);

// TEST conexión DB
const db = require('./config/db'); 

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1');
        res.json({ ok: true, message: 'DB funcionando en Render' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, error: error.message });
    }
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor HabitCore activo en puerto ${PORT}`);
});