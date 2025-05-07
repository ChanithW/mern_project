const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const bcrypt = require('bcryptjs');

// Login user and return JWT token
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET || '952ea376329907b8a723ab4e862186d38fe6c03170f3ba289ae2e97a43ee23ba',
      { expiresIn: '8h' }
    );
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Protect routes middleware
exports.protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '952ea376329907b8a723ab4e862186d38fe6c03170f3ba289ae2e97a43ee23ba');
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Role-based authorization middleware
// authController.js
exports.authorize = (...roles) => {
    return (req, res, next) => {
      // Add error checking
      if (!roles || !Array.isArray(roles)) {
        return res.status(500).json({
          message: 'Invalid role configuration'
        });
      }
  
      if (!req.user?.role) {
        return res.status(401).json({
          message: 'User role not found'
        });
      }
  
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Role ${req.user.role} is not authorized to access this route`
        });
      }
      
      next();
    };
  };