const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const bcrypt = require('bcrypt');

// Routes
const usersRouter = require('./routes/users');
const incomeRouter = require('./routes/income');
const expensesRouter = require('./routes/expenses');
const categoriesRouter = require('./routes/categories');
const budgetsRouter = require('./routes/budgets');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRouter);
app.use('/api/income', incomeRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/budgets', budgetsRouter);

const createDefaultAdmin = async () => {
  try {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    const user = await pool.query('SELECT * FROM users WHERE username = $1', [
      adminUsername,
    ]);

    if (user.rows.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await pool.query(
        'INSERT INTO users (username, password, is_admin) VALUES ($1, $2, $3) RETURNING *',
        [adminUsername, hashedPassword, true]
      );
      console.log('Default admin user created');
    }
  } catch (err) {
    console.error(err.message);
  }
};

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  createDefaultAdmin();
});
