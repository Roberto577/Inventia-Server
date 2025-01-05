const pool = require('../db/pool');
const moment = require('moment');

exports.createVencimiento = async (req, res) => {
    const { producto_bodega_id, fecha_vencimiento, cantidad, usuario_id} = req.body;
    console.log('req.bodyVenci',req.body)

    if (!producto_bodega_id || !fecha_vencimiento || !cantidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    const fechaVencimiento = moment(req.body.fecha_vencimiento, 'DD-MM-YYYY').format('YYYY-MM-DD');

    try {
        const query = `
            INSERT INTO vencimientos_productos_bodega (producto_bodega_id, fecha_vencimiento, cantidad, fecha_creacion, usuario_id)
            VALUES ($1, $2, $3, NOW(), $4)
            RETURNING *;
        `;
        const values = [producto_bodega_id, fechaVencimiento, cantidad, usuario_id];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al crear el vencimiento." });
    }
};
  
// Obtener todos los vencimientos por producto_bodega_id
exports.getVencimientosByProductoBodegaId = async (req, res) => {
    const { producto_bodega_id } = req.params;

    try {
        const query = `
            SELECT 
                vpb.*, 
                p.nombre AS producto_nombre, 
                u.nombre AS usuario_nombre
            FROM 
                vencimientos_productos_bodega vpb
            JOIN 
                productos_bodega pb ON vpb.producto_bodega_id = pb.id
            JOIN 
                productos p ON pb.producto_id = p.id
            JOIN 
                usuarios u ON vpb.usuario_id = u.id
            WHERE 
                vpb.producto_bodega_id = $1;
        `;
        const result = await pool.query(query, [producto_bodega_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al obtener los vencimientos." });
    }
};

// Obtener todos los vencimientos
exports.getAllVencimientos = async (req, res) => {
    try {
        const query = `
            SELECT 
                vpb.*, 
                p.nombre AS producto_nombre, 
                u.nombre AS usuario_nombre
            FROM 
                vencimientos_productos_bodega vpb
            JOIN 
                productos_bodega pb ON vpb.producto_bodega_id = pb.id
            JOIN 
                productos p ON pb.producto_id = p.id
            JOIN 
                usuarios u ON vpb.usuario_id = u.id;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al obtener todos los vencimientos." });
    }
};