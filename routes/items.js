const router = require("express").Router();
const prisma = require("../db"); 

// GET /api/item --- this will get all the items available
router.get("/items", async (req, res) => {});

// GET /api/Items/:item_id --- this will get a certain item with item_id
router.get("/items/:item_id", async (req, res) => {});

// POST /api/items/ --- this will add a new item, the new items info will be added through the headers and json
router.post("/items", async (req, res) => {});

// PUT /api/items/:item_id --- this will allow the items info to be modified, like price, size, etc.
router.put("/items/:item_id", async (req, res) => {});

// DELETE /api/items/:item_id --- this will delete the item with the item_id    
router.delete("/items/:item_id", async (req, res) => {});


