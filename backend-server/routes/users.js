const router = require("express").Router();
const prisma = require("../prisma/db"); 
require('dotenv').config();

// GET /api/users --- this will get all the users available
router.get("/", async (req, res) => {
    res.status(200).json([]); // Placeholder for actual implementation
});

// GET /api/users/:user_id --- this will get a certain user with user_id
rouuter.get("/:user_id", async (req, res) => {
    res.status(200).json([]); // Placeholder for actual implementation
});

// POST /api/users/ --- this will add a new user, the new users info will be added through the headers and json
router.post("/", async (req, res) => {
    res.status(200).json([]); // Placeholder for actual implementation
});

// PUT /api/users/:user_id --- this will allow the users info to be modified, like password, email, etc.
router.put("/:user_id", async (req, res) => {
    res.status(200).json([]); // Placeholder for actual implementation
});

// DELETE /api/users/:user_id --- this will delete the user with the user_id
router.delete("/:user_id", async (req, res) => {
    res.status(200).json([]); // Placeholder for actual implementation
}); 

// Export the router
module.exports = router;