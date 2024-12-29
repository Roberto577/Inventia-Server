const pool = require('../db/pool');

exports.createVencimiento = async (req, res) => {
    const { producto_bodega_id, fecha_vencimiento, cantidad} = req.body;

    if (!producto_bodega_id || !fecha_vencimiento || !cantidad) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    try {
        const query = `
            INSERT INTO vencimientos_productos_bodega (producto_bodega_id, fecha_vencimiento, cantidad, fecha_creacion)
            VALUES ($1, $2, $3, NOW())
            RETURNING *;
        `;
        const values = [producto_bodega_id, fecha_vencimiento, cantidad];

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
            SELECT * FROM vencimientos_productos_bodega
            WHERE producto_bodega_id = $1;
        `;
        const result = await pool.query(query, [producto_bodega_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al obtener los vencimientos." });
    }
};