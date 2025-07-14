const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Add income
router.post('/', auth, async (req, res) => {
  try {
    const { budget_id, amount, income_date } = req.body;
    const result = await pool.query(
      'INSERT INTO income (budget_id, amount, income_date) VALUES (?, ?, ?)',
      [budget_id, amount, income_date]
    );

    const newIncome = await pool.query(
      'SELECT * FROM income WHERE income_id = ?',
      [result.rows[0].id]
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
      'SELECT * FROM income WHERE budget_id = ? ORDER BY income_date DESC',
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
    
    await pool.query(
      'UPDATE income SET amount = ?, income_date = ? WHERE income_id = ?',
      [amount, income_date, id]
    );

    const updatedIncome = await pool.query(
      'SELECT * FROM income WHERE income_id = ?',
      [id]
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
    
    await pool.query('DELETE FROM income WHERE income_id = ?', [id]);
    res.json({ message: 'Income deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
