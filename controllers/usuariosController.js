const pool = require('../db/pool');
const bcrypt = require('bcrypt');

exports.getUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY id ASC');
    res.json(result.rows);
    console.log(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsuariosTipoPacientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * 
      FROM usuarios 
      WHERE tipo_usuario = $1 
      AND id NOT IN (SELECT usuario_id FROM pacientes)
      ORDER BY id ASC
    `, ['Paciente']);
    
    res.json(result.rows);
    console.log(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUsuario = async (req, res) => {
  const {
    rut,
    nombre,
    email,
    telefono,
    fechaNacimiento,
    genero,
    tipo_usuario,
    password
  } = req.body;

  // Asegúrate de que la fecha esté en el formato correcto
  const [day, month, year] = fechaNacimiento.split('-');
  const correctedDate = `${year}-${month}-${day}`;

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (rut, nombre, email, telefono, fecha_nacimiento, genero, tipo_usuario, password) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [rut, nombre, email, telefono, correctedDate, genero, tipo_usuario, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log('err', err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, telefono, fecha_nacimiento, genero, tipo_usuario } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nombre = $1, email = $2, telefono = $3, fecha_nacimiento = $4, genero = $5, tipo_usuario = $6 WHERE id = $7 RETURNING *',
      [nombre, email, telefono, fecha_nacimiento, genero, tipo_usuario, id]
    );
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length > 0) {
      res.json({ message: 'Usuario eliminado con éxito' });
    } else {
      res.status(404).json({ error: 'Usuario no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
