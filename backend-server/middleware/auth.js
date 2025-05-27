const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate JWT token
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: '24h' }
  );
}

// Authenticate token middleware
function authenticateToken(req, res, next) {
  // Get the auth header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  // Verify the token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    
    // Add the user info to the request object
    req.user = user;
    next();
  });
}

// Middleware to check if user matches the user ID in params
function checkUserAuthorization(req, res, next) {
  // Check if the authenticated user matches the requested user ID
  if (req.user.id !== parseInt(req.params.userId)) {
    return res.status(403).json({ error: 'Unauthorized access to this resource' });
  }
  next();
}

// Middleware to check if user has admin role
function requireAdmin(req, res, next) {
  console.log('Checking admin privileges for user:', req.user);
  if (req.user.role !== 'administrator') {
    return res.status(403).json({ error: 'Admin privileges required' });
  }
  next();
}

// Middleware to check if user has employee or admin role
function requireEmployee(req, res, next) {
  if (req.user.role !== 'employee' && req.user.role !== 'administrator') {
    return res.status(403).json({ error: 'Employee privileges required' });
  }
  next();
}

// Middleware to check if user can modify a resource (own resource or admin)
function canModifyResource(req, res, next) {
  const resourceUserId = parseInt(req.params.userId);
  
  // Allow if user is modifying their own resource or is an admin
  if (req.user.id === resourceUserId || req.user.role === 'administrator') {
    return next();
  }
  
  return res.status(403).json({ error: 'Unauthorized to modify this resource' });
}

module.exports = {
  generateToken,
  authenticateToken,
  checkUserAuthorization,
  requireAdmin,
  requireEmployee,
  canModifyResource
};
