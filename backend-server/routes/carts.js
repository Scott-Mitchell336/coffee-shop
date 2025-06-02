const router = require("express").Router();
const prisma = require("../prisma/db");
require("dotenv").config();
const cartService = require("../services/cartService");
const { authenticateToken, requireAdmin, checkUserAuthorization } = require("../middleware/auth");

console.log("Carts router loaded");

// Add this at the beginning to see all route registrations
console.log("Registered routes for carts:");
[
  "get /:user_id", "post /:user_id", "put /:user_id", "delete /:user_id",
  "delete /", "get /", "post /:user_id/items", "put /:user_id/items/:itemDetailId",
  "delete /:user_id/items/:itemDetailId", "post /guest", "get /guest/:cart_id",
  "post /guest/:cart_id/items", "put /guest/:cart_id/items/:itemDetailId",
  "delete /guest/:cart_id/items/:itemDetailId", "post /transfer"
].forEach(route => console.log(`- ${route}`));

// GUEST CART ROUTES
// These routes handle carts for users who are not logged in

// POST /api/carts/guest - Create a cart for guest users
router.post("/guest", async (req, res) => {
  console.log("POST /api/carts/guest called");
  try {
    const cart = await cartService.createGuestCart();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating guest cart:", error);
    res.status(500).json({ error: "Failed to create guest cart", message: error.message });
  }
});

// GET /api/carts/guest/:cart_id - Get a guest cart by its ID
router.get("/guest/:cart_id", async (req, res) => {
  try {
    const cart = await cartService.getGuestCartById(req.params.cart_id);
    
    if (!cart) {
      return res.status(404).json({ error: "Guest cart not found" });
    }
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching guest cart:", error);
    res.status(500).json({ error: "Failed to fetch guest cart", message: error.message });
  }
});

// POST /api/carts/guest/:cart_id/items - Add an item to a guest cart
router.post("/guest/:cart_id/items", async (req, res) => {
  try {
    const { itemId, quantity, instructions } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const cart = await cartService.addItemToGuestCart(req.params.cart_id, {
      itemId,
      quantity,
      instructions
    });
    
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding item to guest cart:", error);
    res.status(500).json({ error: "Failed to add item to guest cart", message: error.message });
  }
});

// PUT /api/carts/guest/:cart_id/items/:itemDetailId - Update an item in a guest cart
router.put("/guest/:cart_id/items/:itemDetailId", async (req, res) => {
  try {
    const { quantity, instructions } = req.body;
    
    const cart = await cartService.updateGuestCartItem(
      req.params.cart_id,
      req.params.itemDetailId,
      { quantity, instructions }
    );
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating guest cart item:", error);
    res.status(500).json({ error: "Failed to update guest cart item", message: error.message });
  }
});

// DELETE /api/carts/guest/:cart_id/items/:itemDetailId - Remove an item from a guest cart
router.delete("/guest/:cart_id/items/:itemDetailId", async (req, res) => {
  try {
    const cart = await cartService.removeGuestCartItem(
      req.params.cart_id,
      req.params.itemDetailId
    );
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing guest cart item:", error);
    res.status(500).json({ error: "Failed to remove guest cart item", message: error.message });
  }
});

// POST /api/carts/transfer - Transfer a guest cart to a user account
router.post("/transfer", authenticateToken, async (req, res) => {
  try {
    const { guestCartId } = req.body;
    const userId = req.user.id;
    
    if (!guestCartId) {
      return res.status(400).json({ error: "Guest cart ID is required" });
    }
    
    const mergedCart = await cartService.transferGuestCartToUser(guestCartId, userId);
    
    res.status(200).json({
      message: "Guest cart transferred successfully",
      cart: mergedCart
    });
  } catch (error) {
    console.error("Error transferring guest cart:", error);
    res.status(500).json({ error: "Failed to transfer guest cart", message: error.message });
  }
});

// AUTHENTICATED USER CART ROUTES
// These routes handle carts for authenticated users
// GET  /api/carts/:user_id   --- this will get all the cart with user_id
router.get("/:user_id", authenticateToken, async (req, res) => {
  console.log("GET  /api/carts/:user_id called");
  console.log("Fetching cart for user_id:", req.params.user_id);
  
  try {
    // Check if user is requesting their own cart or is an admin
    if (req.user.id !== parseInt(req.params.user_id) && req.user.role !== 'administrator') {
      return res.status(403).json({ error: "Unauthorized access to this cart" });
    }
    
    const cart = await cartService.getCartById(req.params.user_id);
    if (!cart) {
      return res.status(404).json({ error: "No cart found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch cart", message: error.message });
  }
});

// POST /api/carts/:user_id  --- this will create a cart for the user with user_id,
//								a value of -1 for user_id this will create a
//								cart not assocaited with a user who has an account
router.post("/:user_id", authenticateToken, async (req, res) => {
  console.log("POST /api/carts/:user_id called");
  try {
    // For non-admin users, they can only create a cart for themselves
    if (req.user.id !== parseInt(req.params.user_id) && req.user.role !== 'administrator') {
      return res.status(403).json({ error: "Unauthorized to create cart for another user" });
    }
    
    const cart = await cartService.createCartWithUserId(req.params.user_id);

    if (!cart) {
      return res.status(400).json({ error: "Failed to create cart" });
    }

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error creating cart:", error);
    res
      .status(500)
      .json({ error: "Failed to create cart", message: error.message });
  }
});

// PUT /api/carts/:user_id  --- this will update the cart for the user with user_id
router.put("/:user_id", authenticateToken, async (req, res) => {
  try {
    // Users can only update their own cart unless they're an admin
    if (req.user.id !== parseInt(req.params.user_id) && req.user.role !== 'administrator') {
      return res.status(403).json({ error: "Unauthorized to update this cart" });
    }
    
    const cart = await cartService.updateCart(req.params.user_id, req.body);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ error: "Failed to update cart", message: error.message });
  }
});

// DELETE /api/carts/:user_id  --- this will delete the cart for the user with user_id
//                                -1 for user_id will delete the cart not associated with a user
//                                who has an account, not sure how to handle that but we can
//                                figure it out later
// Actually I dont think it will work this way

router.delete("/:user_id", authenticateToken, async (req, res) => {
  try {
    // Users can only delete their own cart unless they're an admin
    if (req.user.id !== parseInt(req.params.user_id) && req.user.role !== 'administrator') {
      return res.status(403).json({ error: "Unauthorized to delete this cart" });
    }
    
    const cart = await cartService.deleteCart(req.params.user_id);
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res
      .status(500)
      .json({ error: "Failed to delete cart", message: error.message });
  }
});

// DELETE /api/carts     --- For deleting non-authenticated user carts by cart_id
//							This could be for carts created by users who don't want an account
router.delete("/", async (req, res) => {
  try {
    const cartId = req.body.cart_id || req.query.cart_id;
    
    if (!cartId) {
      return res.status(400).json({ error: "Cart ID is required" });
    }
    
    const cart = await cartService.deleteCartById(cartId);
    
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    
    res.status(200).json({ message: "Cart deleted successfully" });
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: "Failed to delete cart", message: error.message });
  }
});

// GET /api/carts --- this will get all the carts in the database (admin only)
router.get("/", authenticateToken, requireAdmin, async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        if (!carts || carts.length === 0) {
        return res.status(404).json({ error: "No carts found" });
        }
    
        res.status(200).json(carts);
    } catch (error) {
        console.error("Error fetching carts:", error);
        res
        .status(500)
        .json({ error: "Failed to fetch carts", message: error.message });
    }
});

// POST /api/carts/:user_id/items - Add an item to the cart
router.post("/:user_id/items", authenticateToken, async (req, res) => {
  try {
    // Users can only add items to their own cart unless they're an admin
    if (req.user.id !== parseInt(req.params.user_id) && req.user.role !== 'administrator') {
      return res.status(403).json({ error: "Unauthorized to add items to this cart" });
    }

    const { itemId, quantity, instructions } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: "Item ID is required" });
    }

    const cart = await cartService.addItemToCart(req.params.user_id, {
      itemId,
      quantity,
      instructions
    });

    res.status(201).json(cart);
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart", message: error.message });
  }
});

// PUT /api/carts/:user_id/items/:itemDetailId - Update an item in the cart
router.put("/:user_id/items/:itemDetailId", authenticateToken, async (req, res) => {
  try {
    // Users can only update items in their own cart unless they're an admin
    if (req.user.id !== parseInt(req.params.user_id) && req.user.role !== 'administrator') {
      return res.status(403).json({ error: "Unauthorized to update items in this cart" });
    }

    const { quantity, instructions } = req.body;
    const cart = await cartService.updateCartItem(req.params.user_id, req.params.itemDetailId, {
      quantity,
      instructions
    });

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item", message: error.message });
  }
});

// DELETE /api/carts/:user_id/items/:itemDetailId - Remove an item from the cart
router.delete("/:user_id/items/:itemDetailId", authenticateToken, async (req, res) => {
  try {
    // Users can only remove items from their own cart unless they're an admin
    if (req.user.id !== parseInt(req.params.user_id) && req.user.role !== 'administrator') {
      return res.status(403).json({ error: "Unauthorized to remove items from this cart" });
    }

    const cart = await cartService.removeCartItem(req.params.user_id, req.params.itemDetailId);

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove cart item", message: error.message });
  }
});



module.exports = router;