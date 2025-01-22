const express = require('express');
const router = express.Router();
const fechaVencimientoController = require('../controllers/fechaVencimientoController');

// Ruta para crear un historial de precios
router.post('/', fechaVencimientoController.createVencimiento);
router.get('/bodega/:bodega_id', fechaVencimientoController.getAllVencimientosPorBodega);
router.get('/:producto_bodega_id', fechaVencimientoController.getVencimientosByProductoBodegaId);
// router.post('/', productosController.createProducto);

module.exports = router;