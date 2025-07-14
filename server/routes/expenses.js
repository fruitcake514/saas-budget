const router = require('express').Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Add expense
router.post('/', auth, async (req, res) => {
  try {
    const { budget_id, category_id, amount, expense_date, description, budget_item_id } = req.body;
    const result = await pool.query(
      'INSERT INTO expenses (budget_id, category_id, amount, expense_date, description, budget_item_id) VALUES (?, ?, ?, ?, ?, ?)',
      [budget_id, category_id, amount, expense_date, description, budget_item_id]
    );

    const newExpense = await pool.query(
      'SELECT * FROM expenses WHERE expense_id = ?',
      [result.rows[0].id]
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
      'SELECT * FROM expenses WHERE budget_id = ? ORDER BY expense_date DESC',
      [budget_id]
    );
    res.json(allExpenses.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, amount, expense_date, description, budget_item_id } = req.body;
    
    await pool.query(
      'UPDATE expenses SET category_id = ?, amount = ?, expense_date = ?, description = ?, budget_item_id = ? WHERE expense_id = ?',
      [category_id, amount, expense_date, description, budget_item_id, id]
    );

    const updatedExpense = await pool.query(
      'SELECT * FROM expenses WHERE expense_id = ?',
      [id]
    );

    res.json(updatedExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.query('DELETE FROM expenses WHERE expense_id = ?', [id]);
    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

const csv = require('csv-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/import-csv', auth, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No CSV file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (const row of results) {
            const { budget_id, category_id, amount, expense_date, description, budget_item_id } = row;
            // Basic validation - you might want more robust validation
            if (!budget_id || !category_id || !amount || !expense_date) {
              console.warn('Skipping row due to missing data:', row);
              continue;
            }

            await pool.query(
              'INSERT INTO expenses (budget_id, category_id, amount, expense_date, description, budget_item_id) VALUES (?, ?, ?, ?, ?, ?)',
              [budget_id, category_id, parseFloat(amount), expense_date, description, budget_item_id || null]
            );
          }
          fs.unlinkSync(req.file.path); // Clean up the uploaded file
          res.json({ msg: 'CSV imported successfully' });
        } catch (dbErr) {
          console.error('Database error during CSV import:', dbErr.message);
          fs.unlinkSync(req.file.path); // Clean up the uploaded file
          res.status(500).send('Database error during CSV import');
        }
      });
  } catch (err) {
    console.error('Server error during CSV import:', err.message);
    res.status(500).send('Server error');
  }
});
