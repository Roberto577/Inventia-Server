const pool = require('../db/pool');

exports.createBodega = async (req, res) => {
    const { negocio_id, nombre, region, comuna, direccion } = req.body;
  
    if (!negocio_id || !nombre || !region || !comuna || !direccion) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
  
    try {
      const query = `
        INSERT INTO bodegas (
          negocio_id, nombre, region, comuna, direccion
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
  
      const values = [negocio_id, nombre, region, comuna, direccion];
      const result = await pool.query(query, values);
  
      res.status(201).json({ id: result.rows[0].id, message: 'Bodega creada exitosamente.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error al crear la bodega.' });
    }
};

exports.getBodegasPorNegocio = async (req, res) => {
    const { negocio_id } = req.params;
    console.log('negocio_id',negocio_id);
  
    try {
      const query = 'SELECT * FROM bodegas WHERE negocio_id = $1';
      const result = await pool.query(query, [negocio_id]);
  
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error al obtener las bodegas del negocio' });
    }
};
  
exports.getProductosBajoStock = async (req, res) => {
    const { bodega_id } = req.params;
  
    try {
      const query = `
        SELECT 
          pb.*, 
          p.nombre AS nombre, 
          p.sku, 
          p.imagen_url,
          p.stock
        FROM productos_bodega pb
        INNER JOIN productos p ON pb.producto_id = p.id
        WHERE pb.bodega_id = $1 AND pb.stock < $2;
      `;
      const result = await pool.query(query, [bodega_id, 10]); // Umbral de stock bajo (10)
      
      res.status(200).json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error al obtener productos con bajo stock' });
    }
};  