const express = require('express');
const PORT = 3000;
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
// app.use(bodyParser.json());

// Importar las rutas
const productosRoutes = require('./routes/productosRoutes');
const productosBodegaRoutes = require('./routes/productosBodegaRoutes');
const preciosRoutes = require('./routes/preciosRoutes');
const vencimientoRoutes = require('./routes/fechaVencimientoRoutes');
const movimientoInventarioRoutes = require('./routes/movimientoInventarioRoutes');

// Usar las rutas
app.use('/api/productos', productosRoutes);
app.use('/api/productosBodega', productosBodegaRoutes);
app.use('/api/precios', preciosRoutes);
app.use('/api/vencimiento', vencimientoRoutes);
app.use('/api/movimiento', movimientoInventarioRoutes);

// Rutas
app.get('/', (req, res) => {
    res.send('¡Servidor funcionando!');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});