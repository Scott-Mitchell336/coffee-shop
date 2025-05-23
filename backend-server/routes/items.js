const router = require("express").Router();
const prisma = require("../prisma/db"); 
require('dotenv').config();
const userService = require('../services/itemService');

// GET /api/item --- this will get all the items available
router.get("/", async (req, res) => {
    try {
        const items = await itemService.getAllItems();
        if (!items || items.length === 0) { 
            return res.status(404).json({ error: "No items found" });
        }
        // Check if items is an array
        if (!Array.isArray(items)) {
            return res.status(500).json({ error: "Unexpected response format" });
        }
        // Check if items is empty
        if (items.length === 0) {
            return res.status(404).json({ error: "No items found" });
        }
        res.status(200).json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ error: "Failed to fetch items", message: error.message });
    }
});

// GET /api/Items/:item_id --- this will get a certain item with item_id
router.get("/:item_id", async (req, res) => {
    try {
        const item = await prisma.items.findUnique({
            where: { id: parseInt(req.params.item_id) }
        });

        // Check if item is null
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        
        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: "Failed to fetch item", message: error.message });
    }
});

// POST /api/items/ --- this will add a new item, the new items info will be added through the headers and json
router.post("/", async (req, res) => {
    res.status(200).json([]);
});

// PUT /api/items/:item_id --- this will allow the items info to be modified, like price, size, etc.
router.put("/:item_id", async (req, res) => {
    res.status(200).json([]);
});

// DELETE /api/items/:item_id --- this will delete the item with the item_id    
router.delete("/:item_id", async (req, res) => {
    res.status(200).json([]);
});

module.exports = router;


