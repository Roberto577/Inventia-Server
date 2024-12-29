const pool = require('../db/pool');

exports.createHistorialPrecio = async (req, res) => {
    const { producto_bodega_id, precio_anterior, precio_nuevo, descripcion, usuario_id } = req.body;
  
    if (!producto_bodega_id || !precio_anterior || !precio_nuevo || !usuario_id) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben estar presentes: producto_bodega_id, precio_anterior, precio_nuevo, usuario_id",
      });
    }
  
    try {
      const query = `
        INSERT INTO historial_precios_producto_bodega 
        (producto_bodega_id, precio_anterior, precio_nuevo, fecha_cambio, descripcion, usuario_id)
        VALUES ($1, $2, $3, NOW(), $4, $5)
        RETURNING *;
      `;
  
      const values = [producto_bodega_id, precio_anterior, precio_nuevo, descripcion, usuario_id];
  
      const result = await pool.query(query, values);
  
      res.status(201).json(result.rows[0]); // Devuelve el registro creado
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error al crear el historial de precios" });
    }
};

exports.getHistorialPreciosByProductoBodegaId = async (req, res) => {
  const { id } = req.params; // ID del producto en bodega

  if (!id) {
    return res.status(400).json({ error: "El ID del producto en bodega es obligatorio" });
  }

  try {
    const query = `
      SELECT *
      FROM historial_precios
      WHERE producto_bodega_id = $1
      ORDER BY fecha_cambio DESC;
    `;

    const values = [id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron registros de historial de precios" });
    }

    res.status(200).json(result.rows); // Devuelve el historial de precios
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener el historial de precios" });
  }
};