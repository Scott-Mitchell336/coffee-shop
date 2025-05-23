const router = require("express").Router();
const prisma = require("../prisma/db"); 

// GET  /api/carts/:user_id   --- this will get all the items in the current cart for the user
router.get("/carts/:user_id", async (req, res) => {
    res.status(200).json([]);
});

// POST /api/carts/:user_id  --- this will create a cart for the user with user_id,
//								a value of -1 for user_id this will create able
//								cart not assocaited with a user who has an account
router.post("/carts/:user_id", async (req, res) => {
    res.status(200).json([]);
});

// PUT /api/carts/:user_id  --- this will update the cart for the user with user_id
router.put("/carts/:user_id", async (req, res) => {
    res.status(200).json([]);
});

// DELETE /api/carts/:user_id  --- this will delete the cart for the user with user_id
//                                -1 for user_id will delete the cart not associated with a user
//                                who has an account, not sure how to handle that but we can
//                                figure it out later
router.delete("/carts/:user_id", async (req, res) => {
    res.status(200).json([]);
});

// DELETE /api/carts     --- not sure how to do this, I want to to be able to delete a cart, but it might not be associated
//							as user. It could be a cart that was created by a user who does not want to create
//							an account. I guess I could pass the cart_id in the headers?????
router.delete("/carts", async (req, res) => {
    res.status(200).json([]);
});

// GET /api/carts --- this will get all the carts in the database
router.get("/carts", async (req, res) => {
    res.status(200).json([]);
});

module.exports = router;

