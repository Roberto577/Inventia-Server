const express = require('express');
const router = express.Router();
const negocioController = require('../controllers/negociosController');

// Obtener todos los negocios de un usuario
router.get('/usuario/:usuario_id', negocioController.getNegociosPorUsuario);

// Obtener un negocio por su ID
router.get('/:negocio_id', negocioController.getNegocioPorId);

// Obtener todos los productos de todas las bodegas de un negocio
router.get('/:negocio_id/productos', negocioController.getProductosDeNegocio);

// Ruta para crear un nuevo negocio
router.post('/', negocioController.createNegocio);

module.exports = router;