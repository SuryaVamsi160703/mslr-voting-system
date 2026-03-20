const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Register voter
const register = async (req, res) => {
  try {
    const { email, name, dob, password, scc } = req.body;

    // Validate required fields
    if (!email || !name || !dob || !password || !scc) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required.' 
      });
    }

    // Check if email already exists
    const [existingUser] = await db.query(
      'SELECT email FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is already registered.' 
      });
    }

    // Validate SCC code
    const [sccRecord] = await db.query(
      'SELECT * FROM scc_codes WHERE code = ?',
      [scc]
    );

    if (sccRecord.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid SCC code. Please check your Shangri-La Citizen Code.' 
      });
    }

    if (sccRecord[0].is_used) {
      return res.status(400).json({ 
        success: false, 
        message: 'This SCC code has already been used for registration.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    await db.query(
      'INSERT INTO users (email, name, dob, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [email, name, dob, hashedPassword, 'VOTER']
    );

    // Mark SCC as used
    await db.query(
      'UPDATE scc_codes SET is_used = 1, used_by_email = ?, used_at = NOW() WHERE code = ?',
      [email, scc]
    );

    res.status(201).json({ 
      success: true, 
      message: 'Registration successful. You can now login.' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required.' 
      });
    }

    // Check if user exists
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        email: user.email, 
        role: user.role,
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({ 
      success: true, 
      message: 'Login successful.',
      token,
      user: {
        email: user.email,
        name: user.name,
        dob: user.dob,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT email, name, dob, role FROM users WHERE email = ?',
      [req.user.email]
    );

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    res.json({ 
      success: true, 
      user: users[0] 
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

module.exports = { register, login, getProfile };
