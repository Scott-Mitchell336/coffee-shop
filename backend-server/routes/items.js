const router = require("express").Router();
require('dotenv').config();
const itemService = require('../services/itemService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/items --- this will get all the items available (public - no auth required)
router.get("/", async (req, res) => {
    try {
        const items = await itemService.getAllItems();
        if (!items || items.length === 0) { 
            return res.status(404).json({ error: "No items found" });
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

// GET /api/items/:item_id --- this will get a certain item with item_id (public - no auth required)
router.get("/:itemId", async (req, res) => {
    try {
        const item = await itemService.getItemById(req.params.itemId);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error("Error fetching item:", error);
        res.status(500).json({ error: "Failed to fetch item", message: error.message });
    }
});

// POST /api/items --- this will add a new item to the database (admin only)
router.post("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const item = await itemService.createItem(req.body);
        res.status(201).json(item);
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Failed to create item", message: error.message });
    }
});

// PUT /api/items/:item_id --- this will update an item with item_id (admin only)
router.put("/:itemId", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const item = await itemService.updateItem(req.params.itemId, req.body);
        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Failed to update item", message: error.message });
    }
});

// DELETE /api/items/:item_id --- this will delete an item with item_id (admin only)
router.delete("/:itemId", authenticateToken, requireAdmin, async (req, res) => {
    try {
        await itemService.deleteItem(req.params.itemId);
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item", message: error.message });
    }
});

module.exports = router;


