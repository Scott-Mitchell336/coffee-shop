
// Key used to store guest cart ID in localStorage
const GUEST_CART_KEY = 'guestCartId';


export const getGuestCartId = () => {
  return localStorage.getItem(GUEST_CART_KEY);
};

export const saveGuestCartId = (cartId) => {
  if (cartId) {
    localStorage.setItem(GUEST_CART_KEY, cartId);
  }
};

export const clearGuestCartId = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};
