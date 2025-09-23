console.log('Test simple - servidor corriendo...');

const express = require('express');
const cors = require('cors');

const app = express();

// CORS más permisivo para desarrollo
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente!' });
});

// Rutas de proyectos básicas
app.get('/api/projects', (req, res) => {
    res.json([{ id: 1, name: 'Proyecto de prueba' }]);
});

app.post('/api/projects', (req, res) => {
    console.log('POST recibido:', req.body);
    res.json({ message: 'Proyecto creado', data: req.body });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 Frontend permitido desde: http://localhost:5173`);
});