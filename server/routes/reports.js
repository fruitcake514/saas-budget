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
          to_char(date_trunc('month', income_date), 'YYYY-MM') as month,
          SUM(amount) as total_income
        FROM income
        WHERE budget_id = $1
        GROUP BY 1
      ),
      monthly_expenses AS (
        SELECT
          to_char(date_trunc('month', expense_date), 'YYYY-MM') as month,
          SUM(amount) as total_expenses
        FROM expenses
        WHERE budget_id = $1
        GROUP BY 1
      )
      SELECT 
        COALESCE(mi.month, me.month) as month,
        COALESCE(mi.total_income, 0) as total_income,
        COALESCE(me.total_expenses, 0) as total_expenses
      FROM monthly_income mi
      FULL OUTER JOIN monthly_expenses me ON mi.month = me.month
      ORDER BY month DESC
      `,
      [budget_id]
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
      WHERE e.budget_id = $1
        AND e.expense_date BETWEEN $2 AND $3
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
