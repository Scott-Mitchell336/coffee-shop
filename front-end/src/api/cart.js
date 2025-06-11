///const BASE_URL = "http://localhost:3000";

export const cartApi = {
  // For authenticated users
  addItemToCart: async (authRequest, userId, payload) => {
    const res = await authRequest.post(`${import.meta.env.VITE_API_URL}/cart/${userId}/items`, payload);
    return res.data;
  },

  // For guest carts
  addItemToGuestCart: async (publicRequest, cartId, payload) => {
    const res = await publicRequest.post(`${import.meta.env.VITE_API_URL}/guest-cart/${cartId}/items`, payload);
    return res.data;
  },

  // Create a new guest cart
  createGuestCart: async (publicRequest) => {
    console.log("createGuestCart called at:", new Date().toISOString());
    const res = await publicRequest.post(`${import.meta.env.VITE_API_URL}/guest-cart`);
    return res.data;
  },
};
