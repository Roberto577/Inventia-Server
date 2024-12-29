const express = require('express');
const router = express.Router();
const fechaVencimientoController = require('../controllers/fechaVencimientoController');

// Ruta para crear un historial de precios
router.post('/', fechaVencimientoController.createVencimiento);
// router.get('/:sku', productosController.getProductoBySKU);
// router.post('/', productosController.createProducto);

module.exports = router;