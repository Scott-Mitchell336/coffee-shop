const router = require("express").Router();
const prisma = require("../db"); 


// POST  /api/carts/:user_id/items/:item_id  --- this will add a new item to the cart
router.post("/carts/:user_id/items/:item_id", async (req, res) => {});

// PUT    /api/carts/:user_id/items/:item_id --- this will allow the user to modify this item that is in the cart, the
//												user can modify like the instraction and quantity of the item
router.put("/carts/:user_id/items/:item_id", async (req, res) => {});

// DELETE /api/carts/:user_id/items/:item_id --- this will delete the item with the item_id from the cart
router.delete("/carts/:user_id/items/:item_id", async (req, res) => {});

// GET /api/carts/:user_id/items/:item_id --- this will get the item with the item_id from the cart
router.get("/carts/:user_id/items/:item_id", async (req, res) => {});

// GET /api/carts/:user_id/items --- this will get all the items in the cart for the user with user_id
router.get("/carts/:user_id/items", async (req, res) => {});





