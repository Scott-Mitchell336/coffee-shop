import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { cartApi, itemsApi } from "../api/api";

const CartPage = () => {
  const { authRequest, currentUser } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch the user's cart items on mount
  useEffect(() => {
    if (!currentUser) {
      setError("Please log in to view your cart.");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        // Assuming cartApi.getCart returns { items: [{ itemId, quantity, item: { ... } }] }
        const cartData = await cartApi.getCart(authRequest, currentUser.id);
        setCartItems(cartData.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setError("Failed to load cart.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [authRequest, currentUser]);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, cartItem) => total + cartItem.item.price * cartItem.quantity,
    0
  );

  // Handle quantity change
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await cartApi.updateItemQuantity(authRequest, currentUser.id, {
        itemId,
        quantity: newQuantity,
      });
      setCartItems((prev) =>
        prev.map((ci) =>
          ci.itemId === itemId ? { ...ci, quantity: newQuantity } : ci
        )
      );
      setMessage("Cart updated.");
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setMessage("Failed to update quantity.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle remove item
  const removeItem = async (itemId) => {
    if (!window.confirm("Remove this item from your cart?")) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await cartApi.removeItem(authRequest, currentUser.id, itemId);
      setCartItems((prev) => prev.filter((ci) => ci.itemId !== itemId));
      setMessage("Item removed from cart.");
    } catch (err) {
      console.error("Failed to remove item:", err);
      setMessage("Failed to remove item.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading your cart...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (cartItems.length === 0)
    return <p className="text-center text-gray-600">Your cart is empty.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-semibold mb-6">Welcome to Your Cart</h1>

      {cartItems.map(({ itemId, quantity, item }) => (
        <div
          key={itemId}
          className="flex items-center justify-between border-b border-gray-200 py-4"
        >
          <div className="flex items-center space-x-4">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-md"
              />
            )}
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => updateQuantity(itemId, parseInt(e.target.value))}
              disabled={actionLoading}
              className="w-16 border rounded-md px-2 py-1 text-center"
            />
            <button
              onClick={() => removeItem(itemId)}
              disabled={actionLoading}
              className="text-red-600 hover:text-red-800 font-semibold"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="text-right mt-6">
        <p className="text-xl font-semibold">
          Total: <span className="text-blue-600">${totalPrice.toFixed(2)}</span>
        </p>
      </div>

      {message && (
        <p className="mt-4 text-center text-sm text-green-600">{message}</p>
      )}
    </div>
  );
};

export default CartPage;
