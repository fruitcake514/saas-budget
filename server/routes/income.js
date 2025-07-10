const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Add income
router.post('/', auth, async (req, res) => {
  try {
    const { budget_id, amount, income_date } = req.body;
    const newIncome = await pool.query(
      'INSERT INTO income (budget_id, amount, income_date) VALUES ($1, $2, $3) RETURNING *',
      [budget_id, amount, income_date]
    );

    res.json(newIncome.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all income for a budget
router.get('/:budget_id', auth, async (req, res) => {
  try {
    const { budget_id } = req.params;
    const allIncome = await pool.query(
      'SELECT * FROM income WHERE budget_id = $1',
      [budget_id]
    );
    res.json(allIncome.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
