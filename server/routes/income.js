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
      'SELECT * FROM income WHERE budget_id = $1 ORDER BY income_date DESC',
      [budget_id]
    );
    res.json(allIncome.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update income
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, income_date } = req.body;
    
    const updatedIncome = await pool.query(
      'UPDATE income SET amount = $1, income_date = $2 WHERE income_id = $3 RETURNING *',
      [amount, income_date, id]
    );

    res.json(updatedIncome.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete income
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM income WHERE income_id = $1', [id]);
    res.json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
