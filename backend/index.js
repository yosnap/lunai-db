require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const config = require('./config');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS with configuration
app.use(cors(config.cors));

// PostgreSQL connection pool
const pool = new Pool(config.database);

// Basic route to check if the server is running
app.get('/', (req, res) => {
  res.send('En estos momentos el servidor está activo!!!');
});

// --- API Endpoints for Authentication ---
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user by email
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    console.log('User found from DB:', rows[0]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];

    // Compare provided password with hashed password in DB
    const passwordMatch = await bcrypt.compare(password, user.contraseña);
    console.log('Password comparison result:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // For now, just return a success message. In a real app, you'd return a JWT or session token.
    res.json({ message: 'Login successful!', user: { id: user.id, name: user.nombre_usuario, email: user.email, role: user.rol } });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// --- API Endpoints for Users ---

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, nombre_usuario AS name, email, rol, fecha_creacion, activo FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Create a new user
app.post('/api/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const queryText = `
      INSERT INTO usuarios (nombre_usuario, email, contraseña, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre_usuario AS name, email, rol, fecha_creacion, activo;
    `;
    const values = [name, email, hashedPassword, role];

    const { rows } = await pool.query(queryText, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email or username already exists.' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

// Update a user
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required.' });
  }

  try {
    let queryText;
    let values;

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      queryText = `
        UPDATE usuarios
        SET nombre_usuario = $1, email = $2, rol = $3, contraseña = $4
        WHERE id = $5
        RETURNING id, nombre_usuario AS name, email, rol, fecha_creacion, activo;
      `;
      values = [name, email, role, hashedPassword, id];
    } else {
      queryText = `
        UPDATE usuarios
        SET nombre_usuario = $1, email = $2, rol = $3
        WHERE id = $4
        RETURNING id, nombre_usuario AS name, email, rol, fecha_creacion, activo;
      `;
      values = [name, email, role, id];
    }

    console.log('Executing PUT query:', queryText, values);

    const { rows } = await pool.query(queryText, values);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email or username already exists.' });
    }
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete a user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID.' });
    }

    const queryText = 'DELETE FROM usuarios WHERE id = $1';
    const queryValues = [userId];

    console.log('Executing DELETE query:', queryText, queryValues);

    const { rowCount } = await pool.query(queryText, queryValues);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Error during user deletion:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get all roles (now a static list based on your table definition)
app.get('/api/roles', async (req, res) => {
  const roles = ['admin', 'usuario', 'moderador'];
  res.json(roles);
});


app.listen(config.port, () => {
  console.log(`Backend server listening at http://localhost:${config.port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS origins: ${JSON.stringify(config.cors.origin)}`);
});
