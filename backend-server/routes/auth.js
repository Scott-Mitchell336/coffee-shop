const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticateToken, generateToken, requireAdmin } = require("../middleware/auth");
require('dotenv').config();
const authService = require('../services/authService');

// POST /api/auth/register - Register a new user
router.post("/register", async (req, res, next) => {
  try {
    // If registering staff (employee or admin), require admin privileges
    if (req.body.role === 'employee' || req.body.role === 'administrator') {
      // Authentication and authorization check for staff creation
      authenticateToken(req, res, async () => {
        requireAdmin(req, res, async () => {
          await registerUser(req, res, next);
        });
      });
    } else {
      // For regular user registration - no auth needed
      req.body.role = 'user'; // Force role to be 'user'
      await registerUser(req, res, next);
    }
  } catch (error) {
    next(error);
  }
});

// Helper function to handle user registration
async function registerUser(req, res, next) {
  try {
    // Check if user already exists
    const existingUser = await authService.findUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("User already exists.");
    }

    // Check if email already exists
    const existingEmail = await authService.findUserByEmail(req.body.email);
    if (existingEmail) {
      return res.status(400).send("Email already exists.");
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    // Register the new user
    const user = await authService.registerUser({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role || 'user',
    });

    // Create a token
    const token = generateToken(user);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login - Login a user
router.post("/login", async (req, res, next) => {
  try {
    // Validate user credentials
    const user = await authService.validateUserCredentials(req.body.username, req.body.password);

    if (!user) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Create a token
    const token = generateToken(user);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me - Get current user info
router.get("/me", authenticateToken, async (req, res, next) => {
  try {
    // Use the user ID from the token (set by authenticateToken middleware)
    const user = await authService.getUserById(req.user.id);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
