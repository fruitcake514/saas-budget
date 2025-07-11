const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create a new budget
router.post('/', auth, async (req, res) => {
  try {
    const { budget_name } = req.body;
    const newBudget = await pool.query(
      'INSERT INTO budgets (budget_name, owner_id) VALUES ($1, $2) RETURNING *',
      [budget_name, req.user.user_id]
    );

    await pool.query(
      'INSERT INTO user_budgets (user_id, budget_id) VALUES ($1, $2)',
      [req.user.user_id, newBudget.rows[0].budget_id]
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
      'SELECT * FROM budgets WHERE budget_id IN (SELECT budget_id FROM user_budgets WHERE user_id = $1)',
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
      'SELECT * FROM budgets WHERE budget_id = $1 AND owner_id = $2',
      [budget_id, req.user.user_id]
    );

    if (budget.rows.length === 0) {
      return res.status(401).json('You are not the owner of this budget');
    }

    const shareWithUser = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [share_with_username]
    );

    if (shareWithUser.rows.length === 0) {
      return res.status(404).json('User not found');
    }

    await pool.query(
      'INSERT INTO user_budgets (user_id, budget_id) VALUES ($1, $2)',
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
      'SELECT * FROM budgets WHERE budget_id = $1 AND owner_id = $2',
      [id, req.user.user_id]
    );

    if (budget.rows.length === 0) {
      return res.status(401).json('You are not the owner of this budget');
    }

    const updatedBudget = await pool.query(
      'UPDATE budgets SET budget_name = $1 WHERE budget_id = $2 RETURNING *',
      [budget_name, id]
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
      'SELECT * FROM budgets WHERE budget_id = $1 AND owner_id = $2',
      [id, req.user.user_id]
    );

    if (budget.rows.length === 0) {
      return res.status(401).json('You are not the owner of this budget');
    }

    // Delete related records first
    await pool.query('DELETE FROM expenses WHERE budget_id = $1', [id]);
    await pool.query('DELETE FROM income WHERE budget_id = $1', [id]);
    await pool.query('DELETE FROM user_budgets WHERE budget_id = $1', [id]);
    await pool.query('DELETE FROM budgets WHERE budget_id = $1', [id]);

    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
