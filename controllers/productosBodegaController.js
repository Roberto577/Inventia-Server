const pool = require('../db/pool');

exports.getProductosBodega = async (req, res) => {
    const { bodega_id } = req.params; // Obtiene el ID de la bodega desde los parámetros de la ruta

    console.log('bodega_id',bodega_id)
  
    if (!bodega_id) {
      return res.status(400).json({ error: "El ID de la bodega es obligatorio" });
    }
  
    try {
        const query = `
            SELECT 
            pb.*, 
            p.nombre AS nombre, 
            p.sku, 
            p.imagen_url,
            p.id_categoria, 
            c.nombre AS categoria
            FROM productos_bodega pb
            INNER JOIN productos p ON pb.producto_id = p.id
            INNER JOIN categorias c ON p.id_categoria = c.id
            WHERE pb.bodega_id = $1;
        `;
  
      const values = [bodega_id];
  
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        console.log('No se encontraron productos para esta bodega');
        return res.status(200).json(result.rows);
      }
  
      res.status(200).json(result.rows); // Devuelve los productos encontrados
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error al obtener los productos de la bodega" });
    }
};

exports.getProductoBodegaByProductoId = async (req, res) => {
  const { bodega_id, producto_id } = req.params; // Obtiene los parámetros desde la ruta

  if (!bodega_id || !producto_id) {
      return res.status(400).json({ error: "El ID de la bodega y el ID del producto son obligatorios" });
  }

  try {
      const query = `
          SELECT 
              pb.*, 
              p.nombre AS producto_nombre, 
              p.sku, 
              p.id_categoria, 
              c.nombre AS categoria
          FROM productos_bodega pb
          INNER JOIN productos p ON pb.producto_id = p.id
          INNER JOIN categorias c ON p.id_categoria = c.id
          WHERE pb.bodega_id = $1 AND pb.producto_id = $2;
      `;

      const values = [bodega_id, producto_id];

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
          return res.status(404).json({ error: "No se encontró el producto en la bodega" });
      }

      res.status(200).json(result.rows[0]); // Devuelve el producto encontrado
  } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Error al obtener el producto de la bodega" });
  }
};  

exports.createProductoBodega = async (req, res) => {
    const { bodega_id, producto_id, stock, precio } = req.body; // Datos enviados desde el cliente

    if (!bodega_id || !producto_id || !stock) {
        return res.status(400).json({ error: "Todos los campos son obligatorios: bodega_id, producto_id, stock" });
    }

    try {
        const query = `
        INSERT INTO productos_bodega (bodega_id, producto_id, stock, precio, fecha_creacion, fecha_actualizacion)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *;
        `;
        const values = [bodega_id, producto_id, stock, precio];

        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]); // Devuelve el producto en bodega creado
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Error al insertar el producto en la bodega" });
    }
};
  
exports.updateProductoBodega = async (req, res) => {
  const { id } = req.params; // ID del producto en bodega
  const { stock, precio } = req.body; // Nuevos valores

  if (!id || (!stock && !precio)) {
    return res.status(400).json({ error: "El ID y al menos un campo a actualizar son obligatorios" });
  }

  try {
    const query = `
      UPDATE productos_bodega
      SET
        stock = COALESCE($1, stock),
        precio = COALESCE($2, precio),
        fecha_actualizacion = NOW()
      WHERE id = $3
      RETURNING *;
    `;

    const values = [stock, precio, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontró el producto en la bodega" });
    }

    res.status(200).json(result.rows[0]); // Devuelve el producto actualizado
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al actualizar el producto en la bodega" });
  }
};

exports.deleteProductoBodega = async (req, res) => {
  const { id } = req.params; // ID del producto en bodega

  if (!id) {
    return res.status(400).json({ error: "El ID es obligatorio" });
  }

  try {
    const query = `
      DELETE FROM productos_bodega
      WHERE id = $1
      RETURNING *;
    `;

    const values = [id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No se encontró el producto en la bodega para eliminar" });
    }

    res.status(200).json({ message: "Producto eliminado correctamente", producto: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al eliminar el producto en la bodega" });
  }
};