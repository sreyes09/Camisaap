const express = require('express');
const connectDB = require('./config/db');
const path = require('path'); // Módulo para rutas absolutas
const { verificarToken } = require('./seguridad/auth');

const app = express();

// Conexión a MongoDB
connectDB();

// Middleware para leer JSON
app.use(express.json());

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/camisetas', require('./routes/camisetas'));

//app.use(express.static(path.join(__dirname,'public')));
app.get('/camiseta',verificarToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'camiseta.html'));
});

app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/carrusel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'carrusel.html'));
});
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/resultado', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'resultado.html'));
});


// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor API escuchando en http://localhost:${PORT}`);
});