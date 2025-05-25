const router = require("express").Router();
require('dotenv').config();
const itemService = require('../services/itemService');

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
        const item = await itemService.getItemById(req.params.item_id);

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
    try {
        const newItem = await itemService.createItem(req.body);

        // Check if newItem is null
        if (!newItem) {
            return res.status(400).json({ error: "Failed to create item" });
        }   

        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error creating item:", error);
        res.status(500).json({ error: "Failed to create item", message: error.message });
    }
    
});

// PUT /api/items/:item_id --- this will allow the items info to be modified, like price, size, etc.
router.put("/:item_id", async (req, res) => {
    try {
        const updatedItem = await itemService.updateItem(req.params.item_id, req.body);
        
        // Check if updatedItem is null
        if (!updatedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error("Error updating item:", error);
        res.status(500).json({ error: "Failed to update item", message: error.message });
    }
});

// DELETE /api/items/:item_id --- this will delete the item with the item_id    
router.delete("/:item_id", async (req, res) => {
    try {
        const deletedItem = await itemService.deleteItem(req.params.item_id);
        
        // Check if deletedItem is null
        if (!deletedItem) {
            return res.status(404).json({ error: "Item not found" });
        }

        res.status(200).json(deletedItem);
    } catch (error) {
        console.error("Error deleting item:", error);
        res.status(500).json({ error: "Failed to delete item", message: error.message });
    }
});

module.exports = router;


