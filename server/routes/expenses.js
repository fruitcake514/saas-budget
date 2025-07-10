const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { budget_id, category_id, amount, expense_date, description } = req.body;
    const newExpense = await pool.query(
      'INSERT INTO expenses (budget_id, category_id, amount, expense_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [budget_id, category_id, amount, expense_date, description]
    );

    res.json(newExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all expenses for a budget
router.get('/:budget_id', auth, async (req, res) => {
  try {
    const { budget_id } = req.params;
    const allExpenses = await pool.query(
      'SELECT * FROM expenses WHERE budget_id = $1',
      [budget_id]
    );
    res.json(allExpenses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
