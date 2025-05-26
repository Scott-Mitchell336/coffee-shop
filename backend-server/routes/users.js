const router = require("express").Router();
const userService = require('../services/userService');
const { authenticateToken, requireAdmin, canModifyResource } = require('../middleware/auth');

// GET /api/users --- get all users (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await userService.getAllUsers();

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users", message: error.message });
    }
});

// GET /api/users/:userId --- get user by ID (own user or admin)
router.get("/:userId", authenticateToken, canModifyResource, async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Failed to fetch user", message: error.message });
    }
});

// POST /api/users/ --- this will add a new user, the new users info will be added through the headers and json
router.post("/", async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);

        // Check if newUser is null
        if (!newUser) {
            return res.status(400).json({ error: "Failed to create user" });
        }   

        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user", message: error.message });
    }
});

// PUT /api/users/:userId --- update user (own user or admin)
router.put("/:userId", authenticateToken, canModifyResource, async (req, res) => {
    try {
        // Prevent role escalation by non-admins
        if (req.body.role && req.user.role !== 'administrator') {
            delete req.body.role;  // Remove role field if not admin
        }
        
        const user = await userService.updateUser(req.params.userId, req.body);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user", message: error.message });
    }
});

// DELETE /api/users/:userId --- delete user (admin only)
router.delete("/:userId", authenticateToken, requireAdmin, async (req, res) => {
    try {
        await userService.deleteUser(req.params.userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user", message: error.message });
    }
});

module.exports = router;