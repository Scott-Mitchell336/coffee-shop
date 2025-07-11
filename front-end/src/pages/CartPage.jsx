import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { user } = useAuth();
  const {
    cart,
    loading,
    updateCartItem,
    removeCartItem,
    refreshCart,
    completeCart,
  } = useCart();
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const initialLoadRef = useRef(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      refreshCart();
    }
  }, []);

  const cartItems =
    cart?.cart_items?.flatMap((cartItem) =>
      cartItem.cart_item_details.map((detail) => ({
        itemId: detail.id,
        quantity: detail.quantity || 0,
        item: detail.items || { name: "Unknown item", price: 0 },
        instructions: detail.instructions || "",
      }))
    ) || [];

  const totalPrice =
    cartItems?.reduce(
      (total, cartItem) =>
        total + (cartItem.item?.price || 0) * (cartItem.quantity || 0),
      0
    ) || 0;

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await updateCartItem(itemId, newQuantity);
      setMessage("Cart updated.");
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setMessage("Failed to update quantity.");
    } finally {
      setActionLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!window.confirm("Remove this item from your cart?")) return;
    setActionLoading(true);
    setMessage(null);
    try {
      await removeCartItem(itemId);
      setMessage("Item removed from cart.");
    } catch (err) {
      console.error("Failed to remove item:", err);
      setMessage("Failed to remove item.");
    } finally {
      setActionLoading(false);
    }
  };
  const handleCheckout = () => {
    //setShowPrompt(false);
    completeCart();
    navigate("/");
  };

  if (loading)
    return <p className="text-center text-gray-600">Loading your cart...</p>;

  if (cartItems?.length === 0)
    return <p className="text-center text-gray-600">Your cart is empty.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-center text-3xl font-semibold mb-4">
        Welcome to Your Cart
      </h1>
      <p className="text-center text-blue-600 max-w-xl mx-auto p-8">Our cafe does not accept requests for order modifications at this time.</p>

      {cartItems.map(({ itemId, quantity, item }) => (
        <div
          key={itemId}
          className="flex items-center justify-between border-b border-gray-200 py-4"
        >
          {/* Left section with image and text */}
          <div className="flex items-center">
            {/* Image container - fixed width for consistent alignment */}
            <div className="w-16 h-16 flex items-center justify-center mr-4">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="object-contain max-h-[50px] max-w-full rounded-md"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No image</span>
                </div>
              )}
            </div>
            
            {/* Text information */}
            <div>
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-blue-600">${item.price.toFixed(2)}</p>
            </div>
          </div>

          {/* Right section with quantity input and remove button */}
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
              className="text-gray-700 hover:text-red-800 font-semibold"
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
        <p className="mt-4 text-center text-med text-red-600">{message}</p>
      )}

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate("/menu")}
          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg shadow transition"
        >
          Add More Items
        </button>

        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-blue-600 hover:bg-indigo-600 text-white font-semibold rounded-lg shadow transition"
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default CartPage;
