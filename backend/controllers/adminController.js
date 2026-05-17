const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const stores = await pool.query('SELECT COUNT(*) FROM stores');
    const ratings = await pool.query('SELECT COUNT(*) FROM ratings');

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalStores: parseInt(stores.rows[0].count),
      totalRatings: parseInt(ratings.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  const { search, role, sortBy = 'name', order = 'ASC' } = req.query;

  const allowedSorts = ['name', 'email', 'role'];
  const sortColumn = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = `
    SELECT u.id, u.name, u.email, u.address, u.role,
      ROUND(AVG(r.rating)::numeric, 2) AS store_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length} OR u.address ILIKE $${params.length})`;
  }

  if (role) {
    params.push(role);
    query += ` AND u.role = $${params.length}`;
  }

  query += ` GROUP BY u.id ORDER BY u.${sortColumn} ${sortOrder}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.address, u.role,
        s.name AS store_name,
        ROUND(AVG(r.rating)::numeric, 2) AS store_rating
       FROM users u
       LEFT JOIN stores s ON s.owner_id = u.id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE u.id = $1
       GROUP BY u.id, s.name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/users
const addUser = async (req, res) => {
  const { name, email, address, password, role } = req.body;

  const allowedRoles = ['admin', 'user', 'owner'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be admin, user, or owner' });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/stores
const getAllStores = async (req, res) => {
  const { search, sortBy = 'name', order = 'ASC' } = req.query;

  const allowedSorts = ['name', 'email', 'address'];
  const sortColumn = allowedSorts.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  let query = `
    SELECT s.id, s.name, s.email, s.address,
      u.name AS owner_name,
      ROUND(AVG(r.rating)::numeric, 2) AS avg_rating
    FROM stores s
    LEFT JOIN users u ON u.id = s.owner_id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (s.name ILIKE $${params.length} OR s.address ILIKE $${params.length})`;
  }

  query += ` GROUP BY s.id, u.name ORDER BY s.${sortColumn} ${sortOrder}`;

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/admin/stores
const addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    if (owner_id) {
      const ownerCheck = await pool.query("SELECT id FROM users WHERE id = $1 AND role = 'owner'", [owner_id]);
      if (ownerCheck.rows.length === 0) {
        return res.status(400).json({ message: 'Owner not found or user is not an owner' });
      }
    }

    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id || null]
    );

    res.status(201).json({ message: 'Store created successfully', store: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/admin/stores/:id/ratings
const getStoreRatings = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT r.id, r.rating, u.name AS user_name, u.email AS user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboard, getAllUsers, getUserById, addUser, getAllStores, addStore, getStoreRatings };
