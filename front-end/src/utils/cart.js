const CART_ID_KEY = "cartId";

// Save cartId to localStorage
export function saveCartId(cartId) {
  if (!cartId) return;
  localStorage.setItem(CART_ID_KEY, cartId);
}

// Get cartId from localStorage
export function getCartId() {
  return localStorage.getItem(CART_ID_KEY);
}

// Remove cartId from localStorage (optional, if you want to clear cart)
export function clearCartId() {
  localStorage.removeItem(CART_ID_KEY);
}
