// Base API URL - change this when deploying to production
//const API_BASE_URL = 'http://localhost:3000/'; 

// These functions are designed to be used with the authRequest and publicRequest 
// functions from AuthContext

// Item CRUD APIs
export const itemsApi = {
  // Get all items (public)
  getItems: async (publicRequest) => {
    return publicRequest('/items');
  },
  
  // Get item by ID (public)
  getItemById: async (publicRequest, id) => {
    return publicRequest(`/items/${id}`);
  },
  
  // Create new item (admin only)
  createItem: async (authRequest, data) => {
    return authRequest('/items', 'POST', data);
  },
  
  // Update item (admin only)
  updateItem: async (authRequest, itemId, data) => {
    return authRequest(`/items/${itemId}`, 'PUT', data);
  },
  
  // Delete item (admin only)
  deleteItem: async (authRequest, itemId) => {
    return authRequest(`/items/${itemId}`, 'DELETE');
  }
};

// Cart APIs
export const cartApi = {
  // Get user cart
  getUserCart: async (authRequest, userId) => {
    console.log("Fetching cart for user ID:", userId);
    return authRequest(`/carts/${userId}`);
  },
  
  // Add item to user cart
  addItemToCart: async (authRequest, userId, itemData) => {
    return authRequest(`/carts/${userId}/items`, 'POST', itemData);
  },
  
  // Update cart item
  updateCartItem: async (authRequest, userId, itemDetailId, updateData) => {
    return authRequest(`/carts/${userId}/items/${itemDetailId}`, 'PUT', updateData);
  },
  
  // Remove item from cart
  removeCartItem: async (authRequest, userId, itemDetailId) => {
    return authRequest(`/carts/${userId}/items/${itemDetailId}`, 'DELETE');
  },
  
  // Guest cart operations
  createGuestCart: async (publicRequest) => {
    return publicRequest('/carts/guest', 'POST');
  },
  
  getGuestCart: async (publicRequest, cartId) => {
    return publicRequest(`/carts/guest/${cartId}`);
  },
  
  addItemToGuestCart: async (publicRequest, cartId, itemData) => {
    return publicRequest(`/carts/guest/${cartId}/items`, 'POST', itemData);
  },
  
  updateGuestCartItem: async (publicRequest, cartId, itemDetailId, updateData) => {
    return publicRequest(`/carts/guest/${cartId}/items/${itemDetailId}`, 'PUT', updateData);
  },
  
  removeGuestCartItem: async (publicRequest, cartId, itemDetailId) => {
    return publicRequest(`/carts/guest/${cartId}/items/${itemDetailId}`, 'DELETE');
  },
  
  // Complete a cart by cart ID (for user carts)
  completeCartById: async (authRequest, cartId) => {
    return await authRequest(`/carts/${cartId}/complete`, 'PUT');
  },

  // Complete a guest cart by cart ID
  completeGuestCartById: async (publicRequest, cartId) => {
    return await publicRequest(`/carts/guest/${cartId}/complete`, 'PUT');
  },
};

// Search APIs
export async function searchItems(publicRequest, query) {
  console.log("Searching for items with query:", query);
  if (!query) {
    return [];
  }
  try {
    const response = await publicRequest(`/items/search?query=${encodeURIComponent(query)}`);
    console.log("Search response:", response);
    if (!response ) {
      throw new Error("Nothing found in search results");
    }
    return response;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
}