const pool = require('../config/db');

// GET /api/stores
const getAllStores = async (req, res) => {
  const { search, sortBy = 'name', order = 'ASC' } = req.query;

  const allowedSorts = ['name', 'email', 'address', 'avg_rating'];
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

  query += ` GROUP BY s.id, u.name`;

  if (sortColumn === 'avg_rating') {
    query += ` ORDER BY avg_rating ${sortOrder} NULLS LAST`;
  } else {
    query += ` ORDER BY s.${sortColumn} ${sortOrder}`;
  }

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/stores/:id
const getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT s.id, s.name, s.email, s.address,
        u.name AS owner_name,
        ROUND(AVG(r.rating)::numeric, 2) AS avg_rating
       FROM stores s
       LEFT JOIN users u ON u.id = s.owner_id
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = $1
       GROUP BY s.id, u.name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllStores, getStoreById };
