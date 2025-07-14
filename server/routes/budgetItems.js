const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create a new budget item
router.post('/', auth, async (req, res) => {
  try {
    const { budget_id, category_id, item_name, allocated_amount } = req.body;
    const result = await pool.query(
      'INSERT INTO budget_items (budget_id, category_id, item_name, allocated_amount) VALUES (?, ?, ?, ?)',
      [budget_id, category_id, item_name, allocated_amount]
    );
    
    const newBudgetItem = await pool.query(
      'SELECT * FROM budget_items WHERE budget_item_id = ?',
      [result.rows[0].id]
    );
    
    res.json(newBudgetItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all budget items for a budget
router.get('/:budget_id', auth, async (req, res) => {
  try {
    const { budget_id } = req.params;
    const allBudgetItems = await pool.query(
      'SELECT * FROM budget_items WHERE budget_id = ? ORDER BY item_name ASC',
      [budget_id]
    );
    res.json(allBudgetItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a budget item
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { item_name, allocated_amount } = req.body;
    await pool.query(
      'UPDATE budget_items SET item_name = ?, allocated_amount = ? WHERE budget_item_id = ?',
      [item_name, allocated_amount, id]
    );
    
    const updatedBudgetItem = await pool.query(
      'SELECT * FROM budget_items WHERE budget_item_id = ?',
      [id]
    );
    
    res.json(updatedBudgetItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a budget item
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM budget_items WHERE budget_item_id = ?', [id]);
    res.json({ message: 'Budget item deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
