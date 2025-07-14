const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Generate a 30-day monthly report for a budget
router.get('/monthly/:budget_id', auth, async (req, res) => {
  try {
    const { budget_id } = req.params;

    const report = await pool.query(
      `
      WITH monthly_income AS (
        SELECT 
          strftime('%Y-%m', income_date) as month,
          SUM(amount) as total_income
        FROM income
        WHERE budget_id = ?
        GROUP BY strftime('%Y-%m', income_date)
      ),
      monthly_expenses AS (
        SELECT
          strftime('%Y-%m', expense_date) as month,
          SUM(amount) as total_expenses
        FROM expenses
        WHERE budget_id = ?
        GROUP BY strftime('%Y-%m', expense_date)
      )
      SELECT 
        COALESCE(mi.month, me.month) as month,
        COALESCE(mi.total_income, 0) as total_income,
        COALESCE(me.total_expenses, 0) as total_expenses
      FROM monthly_income mi
      LEFT JOIN monthly_expenses me ON mi.month = me.month
      UNION
      SELECT 
        COALESCE(mi.month, me.month) as month,
        COALESCE(mi.total_income, 0) as total_income,
        COALESCE(me.total_expenses, 0) as total_expenses
      FROM monthly_expenses me
      LEFT JOIN monthly_income mi ON me.month = mi.month
      WHERE mi.month IS NULL
      ORDER BY month DESC
      `,
      [budget_id, budget_id]
    );

    res.json(report.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get detailed expenses for a 30-day period
router.get('/detailed-expenses/:budget_id', auth, async (req, res) => {
  try {
    const { budget_id } = req.params;
    const { endDate } = req.query; // endDate will be in YYYY-MM-DD format

    if (!endDate) {
      return res.status(400).json({ msg: 'endDate is required' });
    }

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 30); // Calculate 30 days prior

    const detailedExpenses = await pool.query(
      `
      SELECT
        e.expense_id,
        e.amount,
        e.expense_date,
        e.description,
        c.category_name,
        bi.item_name as budget_item_name
      FROM expenses e
      LEFT JOIN categories c ON e.category_id = c.category_id
      LEFT JOIN budget_items bi ON e.budget_item_id = bi.budget_item_id
      WHERE e.budget_id = ?
        AND e.expense_date BETWEEN ? AND ?
      ORDER BY e.expense_date DESC
      `,
      [budget_id, startDate.toISOString().split('T')[0], endDate]
    );

    res.json(detailedExpenses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
