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
const budgetItemsRouter = require('./routes/budgetItems');
const reportsRouter = require('./routes/reports');

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
app.use('/api/budget-items', budgetItemsRouter);
app.use('/api/reports', reportsRouter);

// Function to wait for database to be ready
async function waitForDatabase(maxRetries = 10, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempting database connection (${i + 1}/${maxRetries})...`);
      
      // Test connection only
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      
      console.log('Database connection successful!');
      return true;
    } catch (error) {
      console.log(`Database connection failed: ${error.message}`);
      
      if (i < maxRetries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error('Max retries reached. Could not connect to database.');
  throw new Error('Database connection failed after maximum retries');
}

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
    } else {
      console.log('Default admin user already exists');
    }
  } catch (err) {
    console.error('Error creating default admin:', err.message);
    throw err;
  }
};

// Start server only after database is ready
async function startServer() {
  try {
    // Wait for database to be ready
    await waitForDatabase();
    
    // Create default admin user
    await createDefaultAdmin();
    
    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
