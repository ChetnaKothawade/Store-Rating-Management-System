const pool = require('../config/db');

// POST /api/ratings
const submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await pool.query(
      'SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'You have already rated this store. Use update instead.' });
    }

    const result = await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *',
      [user_id, store_id, rating]
    );

    res.status(201).json({ message: 'Rating submitted', rating: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/ratings/:id
const updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await pool.query('SELECT * FROM ratings WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    if (existing.rows[0].user_id !== user_id) {
      return res.status(403).json({ message: 'You can only update your own ratings' });
    }

    const result = await pool.query(
      'UPDATE ratings SET rating = $1 WHERE id = $2 RETURNING *',
      [rating, id]
    );

    res.json({ message: 'Rating updated', rating: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/ratings/my/:storeId  - user's own rating for a store
const getMyRating = async (req, res) => {
  const { storeId } = req.params;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, storeId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/ratings/store/:storeId  - all ratings for a store (owner)
const getStoreRatings = async (req, res) => {
  const { storeId } = req.params;
  const owner_id = req.user.id;

  try {
    const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1 AND owner_id = $2', [storeId, owner_id]);
    if (storeCheck.rows.length === 0) {
      return res.status(403).json({ message: 'Access denied: not your store' });
    }

    const result = await pool.query(
      `SELECT r.id, r.rating, u.name AS user_name, u.email AS user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY u.name ASC`,
      [storeId]
    );

    const avgResult = await pool.query(
      'SELECT ROUND(AVG(rating)::numeric, 2) AS avg_rating FROM ratings WHERE store_id = $1',
      [storeId]
    );

    res.json({
      ratings: result.rows,
      avg_rating: avgResult.rows[0].avg_rating,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/ratings/owner-dashboard  - for the store owner
const getOwnerDashboard = async (req, res) => {
  const owner_id = req.user.id;

  try {
    const storeResult = await pool.query('SELECT * FROM stores WHERE owner_id = $1', [owner_id]);
    if (storeResult.rows.length === 0) {
      return res.json({ store: null, avg_rating: null, ratings: [] });
    }

    const store = storeResult.rows[0];

    const avgResult = await pool.query(
      'SELECT ROUND(AVG(rating)::numeric, 2) AS avg_rating FROM ratings WHERE store_id = $1',
      [store.id]
    );

    const ratingsResult = await pool.query(
      `SELECT r.id, r.rating, u.name AS user_name, u.email AS user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY u.name ASC`,
      [store.id]
    );

    res.json({
      store,
      avg_rating: avgResult.rows[0].avg_rating,
      ratings: ratingsResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitRating, updateRating, getMyRating, getStoreRatings, getOwnerDashboard };
