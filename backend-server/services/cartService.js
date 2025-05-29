const prisma = require("../prisma/db");

async function getCartById(user_id) {
  return await prisma.carts.findFirst({
    where: {
      user_id: parseInt(user_id),
    },
    include: {
      cart_items: {
        include: {
          cart_item_details: {
            include: {
              items: true // Include item details for each cart item detail
            }
          }
        }
      }
    }
  });
}

async function createCartWithUserId(userId) {
  return await prisma.carts.create({
    data: {
      user_id: parseInt(userId),
      // Don't initialize cart_items here, they'll be created separately
    },
  });
}

async function updateCart(userId, cartData) {
  // First find the cart by user_id
  const cart = await prisma.carts.findFirst({
    where: { user_id: parseInt(userId) }
  });

  if (!cart) {
    return null;
  }

  // Then update it by its id
  return await prisma.carts.update({
    where: { id: cart.id },
    data: cartData,
    include: {
      cart_items: {
        include: {
          cart_item_details: {
            include: {
              items: true
            }
          }
        }
      }
    }
  });
}

async function deleteCart(userId) {
  // First find the cart by user_id
  const cart = await prisma.carts.findFirst({
    where: { user_id: parseInt(userId) }
  });

  if (!cart) {
    return null;
  }

  // Then delete it by its id
  return await prisma.carts.delete({
    where: { id: cart.id }
  });
}

async function getAllCarts() {
  return await prisma.carts.findMany({
    include: {
      cart_items: {
        include: {
          cart_item_details: {
            include: {
              items: true
            }
          }
        }
      }
    }
  });
}

async function deleteCartById(cartId) {
  return await prisma.carts.delete({
    where: { id: parseInt(cartId) },
  });
}

async function getCartsByUserId(userId) {
  return await prisma.carts.findMany({
    where: {
      user_id: parseInt(userId)
    },
    include: {
      cart_items: {
        include: {
          cart_item_details: {
            include: {
              items: true
            }
          }
        }
      }
    }
  });
}

// New function to add an item to a cart
async function addItemToCart(userId, itemData) {
  const { itemId, quantity, instructions } = itemData;

  // Find the cart by user_id
  const cart = await prisma.carts.findFirst({
    where: { user_id: parseInt(userId) },
    include: {
      cart_items: true
    }
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Check if the cart already has a cart_item
  let cartItem;
  if (cart.cart_items && cart.cart_items.length > 0) {
    // Use the existing cart_item if there's one
    cartItem = cart.cart_items[0];
  } else {
    // Create a new cart_item if none exists
    cartItem = await prisma.cart_items.create({
      data: {
        cart_id: cart.id
      }
    });
  }

  // Create cart_item_detail with the item
  const cartItemDetail = await prisma.cart_item_details.create({
    data: {
      cart_item_id: cartItem.id,
      item_id: parseInt(itemId),
      quantity: quantity || 1,
      instructions: instructions || null
    },
    include: {
      items: true
    }
  });

  // Return the updated cart
  return await getCartById(userId);
}

// Function to update an item in the cart
async function updateCartItem(userId, itemDetailId, updateData) {
  // Find the cart and make sure it belongs to the user
  const cart = await prisma.carts.findFirst({
    where: { user_id: parseInt(userId) },
    include: {
      cart_items: {
        include: {
          cart_item_details: true
        }
      }
    }
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Check if the cart item detail belongs to this cart
  const cartItemIds = cart.cart_items.map(item => item.id);
  const cartItemDetail = await prisma.cart_item_details.findFirst({
    where: {
      id: parseInt(itemDetailId),
      cart_item_id: { in: cartItemIds }
    }
  });

  if (!cartItemDetail) {
    throw new Error("Item not found in cart");
  }

  // Update the cart item detail
  const updatedDetail = await prisma.cart_item_details.update({
    where: { id: parseInt(itemDetailId) },
    data: {
      quantity: updateData.quantity !== undefined ? updateData.quantity : cartItemDetail.quantity,
      instructions: updateData.instructions !== undefined ? updateData.instructions : cartItemDetail.instructions
    },
    include: {
      items: true
    }
  });

  // Return the updated cart
  return await getCartById(userId);
}

// Function to remove an item from the cart
async function removeCartItem(userId, itemDetailId) {
  // Find the cart and make sure it belongs to the user
  const cart = await prisma.carts.findFirst({
    where: { user_id: parseInt(userId) },
    include: {
      cart_items: {
        include: {
          cart_item_details: true
        }
      }
    }
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  // Check if the cart item detail belongs to this cart
  const cartItemIds = cart.cart_items.map(item => item.id);
  const cartItemDetail = await prisma.cart_item_details.findFirst({
    where: {
      id: parseInt(itemDetailId),
      cart_item_id: { in: cartItemIds }
    }
  });

  if (!cartItemDetail) {
    throw new Error("Item not found in cart");
  }

  // Delete the cart item detail
  await prisma.cart_item_details.delete({
    where: { id: parseInt(itemDetailId) }
  });

  // Check if the cart_item has no more details and delete if empty
  const remainingDetails = await prisma.cart_item_details.findMany({
    where: { cart_item_id: cartItemDetail.cart_item_id }
  });

  if (remainingDetails.length === 0) {
    await prisma.cart_items.delete({
      where: { id: cartItemDetail.cart_item_id }
    });
  }

  // Return the updated cart
  return await getCartById(userId);
}

module.exports = {
  getCartById,
  getCartsByUserId,
  createCartWithUserId,
  updateCart,
  deleteCart,
  getAllCarts,
  deleteCartById,
  addItemToCart,
  updateCartItem,
  removeCartItem
};
