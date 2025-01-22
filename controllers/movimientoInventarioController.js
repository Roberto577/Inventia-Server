const pool = require('../db/pool');

// Crear un nuevo movimiento
exports.createMovimiento = async (req, res) => {
  const { producto_bodega_id, tipo_movimiento, cantidad, descripcion, usuario_id } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      `INSERT INTO movimientos_productos_bodega 
      (producto_bodega_id, tipo_movimiento, cantidad, fecha_movimiento, descripcion, usuario_id) 
      VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *`,
      [producto_bodega_id, tipo_movimiento, cantidad, descripcion, usuario_id]
    );
    res.status(201).json(result.rows[0]);
    console.log('result.rows[0]',result.rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el movimiento', error });
    console.log(error,'error')
  }
};

// Obtener todos los movimientos
exports.getAllMovimientosPorBodega = async (req, res) => {
  const { bodega_id } = req.params;
  console.log('holaaaaa')

  try {
    const query = `
      SELECT 
        mpb.*, 
        p.nombre AS producto_nombre, 
        u.nombre AS usuario_nombre
      FROM 
        movimientos_productos_bodega mpb
      JOIN 
        productos_bodega pb ON mpb.producto_bodega_id = pb.id
      JOIN 
        productos p ON pb.producto_id = p.id
      JOIN 
        usuarios u ON mpb.usuario_id = u.id
      WHERE mpb.bodega_id = $1
      ORDER BY id DESC;
    `;
    const result = await pool.query(query, [bodega_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los movimientos', error });
  }
};

// Obtener todos los movimientos por id del producto en la bodega
exports.getMovimientoByProductoBodegaId = async (req, res) => {
  const { producto_bodega_id } = req.params;
  console.log('Hola',producto_bodega_id);

  console.log('producto_bodega_id', producto_bodega_id);
  try {
    const result = await pool.query(
      `
      SELECT 
        mpb.*, 
        p.nombre AS producto_nombre, 
        u.nombre AS usuario_nombre
      FROM 
        movimientos_productos_bodega mpb
      JOIN 
        productos_bodega pb ON mpb.producto_bodega_id = pb.id
      JOIN 
        productos p ON pb.producto_id = p.id
      JOIN 
        usuarios u ON mpb.usuario_id = u.id
      WHERE 
        mpb.producto_bodega_id = $1
      ORDER BY id DESC
      `,
      [producto_bodega_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el movimiento', error });
  }
};

// Actualizar un movimiento por ID
exports.updateMovimiento = async (req, res) => {
  const { id } = req.params;
  const { producto_bodega_id, tipo_movimiento, cantidad, fecha_movimiento, descripcion, usuario_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE movimientos_productos_bodega SET 
      producto_bodega_id = $1, tipo_movimiento = $2, cantidad = $3, fecha_movimiento = $4, descripcion = $5, usuario_id = $6
      WHERE id = $7 RETURNING *`,
      [producto_bodega_id, tipo_movimiento, cantidad, fecha_movimiento, descripcion, usuario_id, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el movimiento', error });
  }
};

// Eliminar un movimiento por ID
exports.deleteMovimiento = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`DELETE FROM movimientos_productos_bodega WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movimiento no encontrado' });
    }
    res.status(200).json({ message: 'Movimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el movimiento', error });
  }
};