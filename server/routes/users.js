const router = require('express').Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Admin: Create a new user
router.post('/register', auth, async (req, res) => {
  try {
    const { username, password, is_admin } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (username, password, is_admin) VALUES (?, ?, ?)',
      [username, hashedPassword, is_admin]
    );

    const newUser = await pool.query(
      'SELECT * FROM users WHERE user_id = ?',
      [result.rows[0].id]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// User: Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE username = ?', [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json('Invalid Credential');
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json('Invalid Credential');
    }

    const token = jwt.sign({ user: user.rows[0] }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Get all users
router.get('/', auth, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json('Access denied');
    }
    const allUsers = await pool.query('SELECT user_id, username, is_admin FROM users');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Update user
router.put('/:id', auth, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json('Access denied');
    }
    const { id } = req.params;
    const { username, password, is_admin } = req.body;
    
    let updateQuery;
    let values;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateQuery = 'UPDATE users SET username = ?, password = ?, is_admin = ? WHERE user_id = ?';
      values = [username, hashedPassword, is_admin, id];
    } else {
      updateQuery = 'UPDATE users SET username = ?, is_admin = ? WHERE user_id = ?';
      values = [username, is_admin, id];
    }
    
    await pool.query(updateQuery, values);
    
    const updatedUser = await pool.query(
      'SELECT user_id, username, is_admin FROM users WHERE user_id = ?',
      [id]
    );
    
    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Admin: Delete user
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!req.user.is_admin) {
      return res.status(403).json('Access denied');
    }
    const { id } = req.params;
    
    // Don't allow deleting yourself
    if (parseInt(id) === req.user.user_id) {
      return res.status(400).json('Cannot delete your own account');
    }
    
    await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
