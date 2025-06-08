const prisma = require("../prisma/db");

async function getCartById(user_id) {
  return await prisma.carts.findFirst({
    where: {
      user_id: parseInt(user_id),
      cart_completed: false // Only get active (not completed) carts
    },
    include: {
      cart_items: {
        include: {
          cart_item_details: {
            include: {
              items: true // Include item details for each cart item detail
            },
            // Add orderBy to ensure consistent ordering
            orderBy: {
              created_at: 'asc'
              //id: 'asc' // Sort by ID ascending (oldest first)
              // Or use creation timestamp: created_at: 'asc'
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
  // First find the active cart by user_id
  const cart = await prisma.carts.findFirst({
    where: { 
      user_id: parseInt(userId),
      cart_completed: false
    }
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
  // First find the active cart by user_id
  const cart = await prisma.carts.findFirst({
    where: { 
      user_id: parseInt(userId),
      cart_completed: false
    }
  });

  if (!cart) {
    return null;
  }

  // Then delete it by its id
  return await prisma.carts.delete({
    where: { id: cart.id }
  });
}

/**
 * Remove all items from a specific cart
 * @param {number|string} cartId - The ID of the cart to clear
 * @returns {Promise<Object>} The updated cart with no items
 */
async function removeAllItemsFromCart(cartId) {
  // First, find the cart to make sure it exists
  const cart = await prisma.carts.findUnique({
    where: { id: parseInt(cartId) },
    include: {
      cart_items: {
        include: {
          cart_item_details: true
        }
      }
    }
  });

  if (!cart) {
    throw new Error(`Cart with ID ${cartId} not found`);
  }

  // Begin a transaction to ensure data integrity
  return await prisma.$transaction(async (tx) => {
    // Get all cart_item IDs for this cart
    const cartItemIds = cart.cart_items.map(item => item.id);
    
    // Delete all cart_item_details for these cart_items
    if (cartItemIds.length > 0) {
      await tx.cart_item_details.deleteMany({
        where: {
          cart_item_id: {
            in: cartItemIds
          }
        }
      });
      
      // Delete all the cart_items
      await tx.cart_items.deleteMany({
        where: {
          cart_id: parseInt(cartId)
        }
      });
    }
    
    // Return the updated (now empty) cart
    return await tx.carts.findUnique({
      where: { id: parseInt(cartId) },
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

// add an item to a cart
async function addItemToCart(userId, itemData) {
  const { itemId, quantity, instructions } = itemData;

  // Find the active (not completed) cart by user_id
  let cart = await prisma.carts.findFirst({
    where: { 
      user_id: parseInt(userId),
      cart_completed: false 
    },
    include: {
      cart_items: true
    }
  });

  // If there's no active cart, create a new one
  if (!cart) {
    cart = await createCartWithUserId(userId);
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
  console.log("updateCartItem called with:", { userId, itemDetailId, updateData });
  const { quantity, instructions } = updateData;
  // Find the active cart and make sure it belongs to the user
  const cart = await prisma.carts.findFirst({
    where: { 
      user_id: parseInt(userId),
      cart_completed: false 
    },
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
  console.log("Cart item IDs:", cartItemIds);
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
  // Find the active cart and make sure it belongs to the user
  const cart = await prisma.carts.findFirst({
    where: { 
      user_id: parseInt(userId),
      cart_completed: false 
    },
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
// Mark a cart as completed
async function markCartAsComplete(cartId) {
  return await prisma.carts.update({
    where: { id: parseInt(cartId) },
    data: {
      cart_completed: true,
      updated_at: new Date()
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

// Create a cart for a guest (no user_id)
async function createGuestCart() {
  return await prisma.carts.create({
    data: {} // user_id will be null
  });
}

// Get a guest cart by its ID
async function getGuestCartById(cartId) {
  return await prisma.carts.findUnique({
    where: { 
      id: parseInt(cartId),
      cart_completed: false // Only get active (not completed) guest carts
    },
    include: {
      cart_items: {
        include: {
          cart_item_details: {
            include: {
              items: true
            },
            // Add orderBy to ensure consistent ordering
            orderBy: {
              id: 'asc' // Sort by ID ascending (oldest first)
            }
          }
        }
      }
    }
  });
}

// Add an item to a guest cart
async function addItemToGuestCart(cartId, itemData) {
  const { itemId, quantity, instructions } = itemData;

  // Find the active cart by ID
  const cart = await prisma.carts.findUnique({
    where: { 
      id: parseInt(cartId),
      cart_completed: false // Only allow adding items to active carts
    },
    include: {
      cart_items: true
    }
  });

  if (!cart) {
    throw new Error("Active guest cart not found");
  }

  // Get or create a cart_item
  let cartItem;
  if (cart.cart_items && cart.cart_items.length > 0) {
    cartItem = cart.cart_items[0];
  } else {
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
    }
  });

  // Return the updated cart
  return await getGuestCartById(cartId);
}

// Update an item in a guest cart
async function updateGuestCartItem(cartId, itemDetailId, updateData) {
  const { quantity, instructions } = updateData;

  // Check if the active cart exists
  const cart = await prisma.carts.findUnique({
    where: { 
      id: parseInt(cartId),
      cart_completed: false // Only allow updating items in active carts
    }
  });

  if (!cart) {
    throw new Error("Active guest cart not found");
  }

  // Update the cart item detail
  await prisma.cart_item_details.update({
    where: { id: parseInt(itemDetailId) },
    data: {
      quantity: quantity !== undefined ? quantity : undefined,
      instructions: instructions !== undefined ? instructions : undefined
    }
  });

  // Return the updated cart
  return await getGuestCartById(cartId);
}

// Remove an item from a guest cart
async function removeGuestCartItem(cartId, itemDetailId) {
  // Check if the active cart exists
  const cart = await prisma.carts.findUnique({
    where: { 
      id: parseInt(cartId),
      cart_completed: false // Only allow removing items from active carts
    }
  });

  if (!cart) {
    throw new Error("Active guest cart not found");
  }

  // Get the cart item detail to find its cart_item_id
  const cartItemDetail = await prisma.cart_item_details.findUnique({
    where: { id: parseInt(itemDetailId) }
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
  return await getGuestCartById(cartId);
}

// Transfer a guest cart to a user's account
/*async function transferGuestCartToUser(guestCartId, userId) {
  // Begin transaction to ensure all operations succeed or fail together
  return await prisma.$transaction(async (tx) => {
    // Get active guest cart with all items
    const guestCart = await tx.carts.findUnique({
      where: { 
        id: parseInt(guestCartId),
        cart_completed: false // Only transfer active carts
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
    
    if (!guestCart) {
      throw new Error("Active guest cart not found");
    }
    
    // Find or create user cart
    let userCart = await tx.carts.findFirst({
      where: {
        user_id: parseInt(userId),
        cart_completed: false
      },
      include: {
        cart_items: true
      }
    });
    
    if (!userCart) {
      userCart = await tx.carts.create({
        data: {
          user_id: parseInt(userId)
        },
        include: {
          cart_items: true
        }
      });
    }
    
    // Create cart_item for user cart if needed
    let userCartItem;
    if (userCart.cart_items.length > 0) {
      userCartItem = userCart.cart_items[0];
    } else {
      userCartItem = await tx.cart_items.create({
        data: {
          cart_id: userCart.id
        }
      });
    }
    
    // Transfer all item details from guest cart to user cart
    for (const guestCartItem of guestCart.cart_items) {
      for (const detail of guestCartItem.cart_item_details) {
        await tx.cart_item_details.create({
          data: {
            cart_item_id: userCartItem.id,
            item_id: detail.item_id,
            quantity: detail.quantity,
            instructions: detail.instructions
          }
        });
      }
    }
    
    // Delete the guest cart
    await tx.carts.delete({
      where: { id: guestCart.id }
    });
    
    // Return the updated user cart
    return await tx.carts.findUnique({
      where: { id: userCart.id },
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
  });
}*/

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
  removeCartItem,
  createGuestCart,
  getGuestCartById,
  addItemToGuestCart,
  updateGuestCartItem,
  removeGuestCartItem,
  markCartAsComplete
  //transferGuestCartToUser
};
