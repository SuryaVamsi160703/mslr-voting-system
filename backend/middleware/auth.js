const jwt = require('jsonwebtoken');

// Verify JWT token
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};

// Check if user is admin (Election Commission)
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'EC') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};

// Check if user is voter
const isVoter = (req, res, next) => {
  if (req.user.role !== 'VOTER') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Voter privileges required.' 
    });
  }
  next();
};

module.exports = { authenticate, isAdmin, isVoter };
