const router = require("express").Router();
require('dotenv').config();
// Import the user service
const userService = require('../services/userService');

// GET /api/users --- this will get all the users available
router.get("/", async (req, res) => {
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

// GET /api/users/:user_id --- this will get a certain user with user_id
router.get("/:user_id", async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.user_id);

        // Check if user is null
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

// PUT /api/users/:user_id --- this will allow the users info to be modified, like password, email, etc.
router.put("/:user_id", async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.user_id, req.body);
        
        // Check if updatedUser is null
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Failed to update user", message: error.message });
    }
});

// DELETE /api/users/:user_id --- this will delete the user with the user_id
router.delete("/:user_id", async (req, res) => {
    try {
        const deletedUser = await userService.deleteUser(req.params.user_id);
        
        // Check if deletedUser is null
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.status(200).json(deletedUser);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Failed to delete user", message: error.message });
    }
}); 

// Export the router
module.exports = router;