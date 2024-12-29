const pool = require('../db/pool');

// Obtener todos los productos
exports.getAllProductos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    console.log(result.rows);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// obtener un producto en base a su sku
exports.getProductoBySKU = async (req, res) => {
  const { sku } = req.params; // Obtiene el SKU desde los parámetros de la URL

  try {
    const query = `
      SELECT 
          p.*, 
          pb.id AS id_producto_bodega,
          pb.precio AS precio_actual,
          pb.stock AS stock_actual,
          c.nombre AS categoria_nombre
      FROM productos p
      LEFT JOIN productos_bodega pb ON pb.producto_id = p.id
      LEFT JOIN categorias c ON p.id_categoria = c.id
      WHERE p.sku = $1
      LIMIT 1;
    `;
    const values = [sku];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(result.rows[0]); // Devuelve el primer (y único) resultado
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProducto = async (req, res) => {
  console.log('req.body',req.body)
  const { nombre, sku, id_categoria } = req.body; // Datos enviados desde el cliente


  if (!nombre || !sku || !id_categoria) {
    return res.status(400).json({ error: "Todos los campos son obligatorios: nombre, sku, id_categoria" });
  }

  try {
    const query = `
      INSERT INTO productos (nombre, sku, id_categoria)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [nombre, sku, id_categoria];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]); // Devuelve el producto creado
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};