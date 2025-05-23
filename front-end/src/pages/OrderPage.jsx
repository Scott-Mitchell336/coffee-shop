import React, { useState, useEffect } from 'react';
import { getItems } from '../api/api'; // adjust path if needed

const Order = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState({}); // { itemId: quantity }

  useEffect(() => {
    // Fetch items for the menu
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to load items:', error);
      }
    };

    fetchItems();
  }, []);

  const addToCart = (itemId) => {
    setCart(prevCart => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      if (!prevCart[itemId]) return prevCart;

      const newQty = prevCart[itemId] - 1;
      if (newQty <= 0) {
        const { [itemId]: _, ...rest } = prevCart;
        return rest;
      }
      return {
        ...prevCart,
        [itemId]: newQty,
      };
    });
  };

  // Helper to calculate total quantity and price
  const cartItems = Object.entries(cart).map(([itemId, qty]) => {
    const item = items.find(i => i.id === Number(itemId));
    return item ? { ...item, quantity: qty } : null;
  }).filter(Boolean);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h1>Order</h1>
      
      <h2>Menu</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - ${item.price.toFixed(2)}
            <button onClick={() => addToCart(item.id)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <h2>Cart</h2>
      {cartItems.length === 0 && <p>Your cart is empty.</p>}
      {cartItems.length > 0 && (
        <ul>
          {cartItems.map(item => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
              <button onClick={() => addToCart(item.id)}>+</button>
              <button onClick={() => removeFromCart(item.id)}>-</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Total: ${totalPrice.toFixed(2)}</h3>

      <button disabled={cartItems.length === 0} onClick={() => alert('Order placed!')}>
        Place Order
      </button>
    </div>
  );
};

export default Order;

