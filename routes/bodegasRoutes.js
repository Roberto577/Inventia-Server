const express = require('express');
const router = express.Router();
const bodegaController = require('../controllers/bodegasController');

// Obtener todas las bodegas de un negocio
router.get('/:negocio_id', bodegaController.getBodegasPorNegocio);

// Obtener los productos con bajo stock de una bodega
router.get('/:bodega_id/lowStock', bodegaController.getProductosBajoStock);

// Ruta para crear una nueva bodega
router.post('/', bodegaController.createBodega);

module.exports = router;