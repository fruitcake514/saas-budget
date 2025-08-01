const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Add a new category
router.post('/', auth, async (req, res) => {
  try {
    const { category_name, percentage } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (category_name, percentage, is_predefined, user_id) VALUES (?, ?, false, ?)',
      [category_name, percentage, req.user.user_id]
    );

    const newCategory = await pool.query(
      'SELECT * FROM categories WHERE category_id = ?',
      [result.rows[0].id]
    );

    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all categories for a user (predefined and user-created)
router.get('/', auth, async (req, res) => {
  try {
    const allCategories = await pool.query(
      'SELECT * FROM categories WHERE user_id IS NULL OR user_id = ?',
      [req.user.user_id]
    );
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
