const pool = require('../db/pool');

exports.createNegocio = async (req, res) => {
    const { usuario_id, nombre, region, comuna, direccion, email, telefono, tipo_negocio } = req.body;
  
    if (!usuario_id || !nombre || !region || !comuna || !direccion || !email || !tipo_negocio) {
      return res.status(400).json({ error: 'Faltan campos obligatorios.' });
    }
  
    try {
      const query = `
        INSERT INTO negocios (
          usuario_id, nombre, region, comuna, direccion, email, telefono, tipo_negocio
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id;
      `;
      
      const values = [usuario_id, nombre, region, comuna, direccion, email, telefono, tipo_negocio];
      const result = await pool.query(query, values);
  
      res.status(201).json({ id: result.rows[0].id, message: 'Negocio creado exitosamente.' });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Error al crear el negocio.' });
    }
};

exports.getNegociosPorUsuario = async (req, res) => {
    const { usuario_id } = req.params;

    try {
        const query = 'SELECT * FROM negocios WHERE usuario_id = $1';
        const result = await pool.query(query, [usuario_id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener los negocios del usuario' });
    }
};

exports.getNegocioPorId = async (req, res) => {
    const { negocio_id } = req.params;

    try {
        const query = 'SELECT * FROM negocios WHERE id = $1';
        const result = await pool.query(query, [negocio_id]);

        if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Negocio no encontrado' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener el negocio' });
    }
};

exports.getProductosDeNegocio = async (req, res) => {
    const { negocio_id } = req.params;

    try {
        const query = `
        SELECT 
            p.id AS producto_id, 
            p.nombre, 
            p.sku, 
            p.imagen_url, 
            pb.stock, 
            pb.bodega_id
        FROM productos_bodega pb
        INNER JOIN productos p ON pb.producto_id = p.id
        WHERE pb.bodega_id IN (SELECT id FROM bodega WHERE negocio_id = $1);
        `;
        const result = await pool.query(query, [negocio_id]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Error al obtener los productos del negocio' });
    }
};