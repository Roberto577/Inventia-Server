const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// router.get('/', verifyToken, isAdmin, usuariosController.getUsuarios);
router.get('/', usuariosController.getUsuarios);
// router.get('/tipoPacientes', usuariosController.getUsuariosTipoPacientes);
router.get('/:id', usuariosController.getUsuarioById);
// router.post('/', verifyToken, isAdmin, usuariosController.createUsuario);
router.post('/', usuariosController.createUsuario);
// router.put('/:id', verifyToken, isAdmin, usuariosController.updateUsuario);
// router.delete('/:id', verifyToken, isAdmin, usuariosController.deleteUsuario);

module.exports = router;