const express = require('express');
const router = express.Router();
const productosBodegaController = require('../controllers/productosBodegaController');

// // Rutas para productos
router.get('/:bodega_id', productosBodegaController.getProductosBodega);
router.get('/:bodega_id/:producto_id', productosBodegaController.getProductoBodegaByProductoId);
router.post('/', productosBodegaController.createProductoBodega);
router.put('/update/:id', productosBodegaController.updateProductoBodega);
router.delete('/productos-bodega/:id', productosBodegaController.deleteProductoBodega);

module.exports = router;