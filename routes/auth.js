const router = require("express").Router();
const prisma = require("../db"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authenticateToken } = require("../middleware/auth");

// POST /api/auth/register - Register a new user
router.post("/register", async (req, res, next) => {
  try {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      },
    });

    // Create a token with the user id
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login - Login a user
router.post("/login", async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username,
      },
    });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Create a token with the user id
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me - Get current user info
router.get("/me", authenticateToken, async (req, res, next) => {
    try {
    // Use the user ID from the token (set by authenticateToken middleware)
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      // Don't include password in the response
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
