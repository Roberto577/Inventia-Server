const express = require('express');
const router = express.Router();
const historialPreciosController = require('../controllers/preciosController');

// Ruta para crear un historial de precios
router.post('/', historialPreciosController.createHistorialPrecio);
router.get('/productos-bodega/:producto_bodega_id/historial-precios', historialPreciosController.getHistorialPreciosByProductoBodegaId);
// router.post('/', productosController.createProducto);

module.exports = router;