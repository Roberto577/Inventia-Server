const pool = require('../db/pool');

exports.createHistorialPrecio = async (req, res) => {
    const { producto_bodega_id, precio_anterior, precio_nuevo, descripcion, usuario_id, bodega_id } = req.body;

    console.log('req.body',req.body)
  
    if (!producto_bodega_id || !precio_anterior || !precio_nuevo || !usuario_id || !bodega_id) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben estar presentes: producto_bodega_id, precio_anterior, precio_nuevo, usuario_id",
      });
    }
  
    try {
      const query = `
        INSERT INTO historial_precios_producto_bodega 
        (producto_bodega_id, precio_anterior, precio_nuevo, fecha_cambio, descripcion, usuario_id, bodega_id)
        VALUES ($1, $2, $3, NOW(), $4, $5, $6)
        RETURNING *;
      `;
  
      const values = [producto_bodega_id, precio_anterior, precio_nuevo, descripcion, usuario_id, bodega_id];
  
      const result = await pool.query(query, values);
  
      res.status(201).json(result.rows[0]); // Devuelve el registro creado
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error al crear el historial de precios" });
    }
};

exports.getHistorialPreciosByProductoBodegaId = async (req, res) => {
  const { producto_bodega_id } = req.params; // ID del producto en bodega
  console.log('Entra?')
  console.log('producto_bodega_id',producto_bodega_id)

  if (!producto_bodega_id) {
    return res.status(400).json({ error: "El ID del producto en bodega es obligatorio" });
  }

  try {
    const query = `
      SELECT 
        hppb.*, 
        p.nombre AS producto_nombre, 
        u.nombre AS usuario_nombre
      FROM 
        historial_precios_producto_bodega hppb
      JOIN 
        productos_bodega pb ON hppb.producto_bodega_id = pb.id
      JOIN 
        productos p ON pb.producto_id = p.id
      JOIN 
        usuarios u ON hppb.usuario_id = u.id
      WHERE 
        hppb.producto_bodega_id = $1
      ORDER BY 
        hppb.fecha_cambio DESC;
    `;


    const values = [producto_bodega_id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontraron registros de historial de precios" });
    }

    res.status(200).json(result.rows); // Devuelve el historial de precios
    console.log('result.rows',result.rows)
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener el historial de precios" });
  }
};