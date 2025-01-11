const express = require('express');
const router = express.Router();
const productosBodegaController = require('../controllers/productosBodegaController');

// // Rutas para productos
router.get('/:bodega_id', productosBodegaController.getProductosBodega);
router.get('/lowStock/:bodega_id', productosBodegaController.getProductosBodegaLowStock);
router.get('/:bodega_id/:producto_id', productosBodegaController.getProductoBodegaByProductoId);
router.get('/stock/:bodega_id/:productobodega_id', productosBodegaController.getStockProductoBodega);
router.post('/', productosBodegaController.createProductoBodega);
router.put('/update/:id', productosBodegaController.updateProductoBodega);
router.delete('/productos-bodega/:id', productosBodegaController.deleteProductoBodega);

module.exports = router;