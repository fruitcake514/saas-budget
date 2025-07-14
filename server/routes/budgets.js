const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create a new budget
router.post('/', auth, async (req, res) => {
  try {
    const { budget_name } = req.body;
    const result = await pool.query(
      'INSERT INTO budgets (budget_name, owner_id) VALUES (?, ?)',
      [budget_name, req.user.user_id]
    );

    await pool.query(
      'INSERT INTO user_budgets (user_id, budget_id) VALUES (?, ?)',
      [req.user.user_id, result.rows[0].id]
    );

    const newBudget = await pool.query(
      'SELECT * FROM budgets WHERE budget_id = ?',
      [result.rows[0].id]
    );

    res.json(newBudget.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all budgets for a user
router.get('/', auth, async (req, res) => {
  try {
    const allBudgets = await pool.query(
      'SELECT * FROM budgets WHERE budget_id IN (SELECT budget_id FROM user_budgets WHERE user_id = ?)',
      [req.user.user_id]
    );
    res.json(allBudgets.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Share a budget with another user
router.post('/share', auth, async (req, res) => {
  try {
    const { budget_id, share_with_username } = req.body;

    const budget = await pool.query(
      'SELECT * FROM budgets WHERE budget_id = ? AND owner_id = ?',
      [budget_id, req.user.user_id]
    );

    if (budget.rows.length === 0) {
      return res.status(401).json('You are not the owner of this budget');
    }

    const shareWithUser = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [share_with_username]
    );

    if (shareWithUser.rows.length === 0) {
      return res.status(404).json('User not found');
    }

    await pool.query(
      'INSERT INTO user_budgets (user_id, budget_id) VALUES (?, ?)',
      [shareWithUser.rows[0].user_id, budget_id]
    );

    res.json('Budget shared successfully');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update budget name
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { budget_name } = req.body;

    const budget = await pool.query(
      'SELECT * FROM budgets WHERE budget_id = ? AND owner_id = ?',
      [id, req.user.user_id]
    );

    if (budget.rows.length === 0) {
      return res.status(401).json('You are not the owner of this budget');
    }

    await pool.query(
      'UPDATE budgets SET budget_name = ? WHERE budget_id = ?',
      [budget_name, id]
    );

    const updatedBudget = await pool.query(
      'SELECT * FROM budgets WHERE budget_id = ?',
      [id]
    );

    res.json(updatedBudget.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await pool.query(
      'SELECT * FROM budgets WHERE budget_id = ? AND owner_id = ?',
      [id, req.user.user_id]
    );

    if (budget.rows.length === 0) {
      return res.status(401).json('You are not the owner of this budget');
    }

    // Delete related records first
    await pool.query('DELETE FROM expenses WHERE budget_id = ?', [id]);
    await pool.query('DELETE FROM income WHERE budget_id = ?', [id]);
    await pool.query('DELETE FROM user_budgets WHERE budget_id = ?', [id]);
    await pool.query('DELETE FROM budgets WHERE budget_id = ?', [id]);

    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
