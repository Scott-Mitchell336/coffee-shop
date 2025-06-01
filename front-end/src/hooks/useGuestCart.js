import { useEffect, useState } from "react";
import { getGuestCartId, setGuestCartId } from "../utils/cart";

export default function useGuestCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createGuestCart() {
    setLoading(true);
    const res = await fetch("/api/carts/guest", { method: "POST" });
    const data = await res.json();
    setGuestCartId(data.id);
    setCart(data);
    setLoading(false);
  }

  async function fetchGuestCart(cartId) {
    setLoading(true);
    const res = await fetch(`/api/carts/guest/${cartId}`);
    if (res.ok) {
      const data = await res.json();
      setCart(data);
    } else {
      // If cart expired or invalid, create new one
      await createGuestCart();
    }
    setLoading(false);
  }

  useEffect(() => {
    const cartId = getGuestCartId();
    if (cartId) {
      fetchGuestCart(cartId);
    } else {
      createGuestCart();
    }
  }, []);

  return { cart, setCart, loading };
}
