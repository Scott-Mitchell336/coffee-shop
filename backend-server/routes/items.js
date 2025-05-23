const router = require("express").Router();
const prisma = require("../prisma/db"); 

// GET /api/item --- this will get all the items available
router.get("/", async (req, res) => {
    res.status(200).json([]);
});

// GET /api/Items/:item_id --- this will get a certain item with item_id
router.get("/:item_id", async (req, res) => {
    res.status(200).json([]);
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


