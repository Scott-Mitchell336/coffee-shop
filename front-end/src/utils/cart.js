// Key used to store guest cart ID in localStorage
const GUEST_CART_KEY = 'guestCartId';


export const getGuestCartId = () => {
  const cartId = localStorage.getItem(GUEST_CART_KEY);
  console.log(`[Storage] Retrieved guestCartId: ${cartId}`);
  return cartId;
};

export const saveGuestCartId = (cartId) => {
  if (cartId) {
    console.log(`[Storage] Saving guestCartId: ${cartId}`);
    localStorage.setItem(GUEST_CART_KEY, cartId);
    // Verify it was saved
    const saved = localStorage.getItem(GUEST_CART_KEY);
    if (saved !== cartId.toString()) {
      console.error(`[Storage] Failed to save guestCartId! Expected ${cartId}, got ${saved}`);
    }
  } else {
    console.warn('[Storage] Attempted to save null/empty guestCartId');
  }
};

export const clearGuestCartId = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};
