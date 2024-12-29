const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

// Rutas para productos
router.get('/', productosController.getAllProductos);
router.get('/:sku', productosController.getProductoBySKU);
router.post('/', productosController.createProducto);

module.exports = router;