const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientoInventarioController');

// Rutas CRUD
router.post('/', movimientosController.createMovimiento);
router.get('/bodega/:bodega_id', movimientosController.getAllMovimientosPorBodega);
router.get('/:producto_bodega_id', movimientosController.getMovimientoByProductoBodegaId);
router.put('/:id', movimientosController.updateMovimiento);
router.delete('/:id', movimientosController.deleteMovimiento);

module.exports = router;