const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Create or update admin user
const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin exists
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      // Update existing admin
      await db.query(
        'UPDATE users SET password_hash = ? WHERE email = ?',
        [hashedPassword, email]
      );
      res.json({
        success: true,
        message: 'Admin password updated successfully'
      });
    } else {
      // Create new admin
      await db.query(
        'INSERT INTO users (email, name, dob, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [email, 'Election Commission', '1990-01-01', hashedPassword, 'EC']
      );
      res.json({
        success: true,
        message: 'Admin user created successfully'
      });
    }
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { createAdmin };
