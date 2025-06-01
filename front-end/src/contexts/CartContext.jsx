import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext'; // Assuming you have this for auth state

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get or create appropriate cart on component mount or when user changes
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (user) {
          // Logged-in user: get their cart
          const response = await fetch(`/api/carts/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (response.ok) {
            const cartData = await response.json();
            setCart(cartData);
          } else if (response.status === 404) {
            // User has no cart yet, that's okay
            setCart(null);
          }
        } else {
          // Guest user: get or create guest cart
          let guestCartId = localStorage.getItem('guestCartId');
          
          if (guestCartId) {
            // Try to fetch existing guest cart
            const response = await fetch(`/api/carts/guest/${guestCartId}`);
            
            if (response.ok) {
              const cartData = await response.json();
              setCart(cartData);
            } else {
              // Guest cart not found or expired, remove from localStorage
              localStorage.removeItem('guestCartId');
              setCart(null);
            }
          } else {
            // No guest cart yet, that's okay
            setCart(null);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Add item to cart
  const addItemToCart = async (itemId, quantity = 1, instructions = '') => {
    try {
      if (user) {
        // Logged-in user
        const response = await fetch(`/api/carts/${user.id}/items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ itemId, quantity, instructions })
        });

        if (response.ok) {
          const updatedCart = await response.json();
          setCart(updatedCart);
          return updatedCart;
        }
      } else {
        // Guest user
        let guestCartId = localStorage.getItem('guestCartId');
        
        if (!guestCartId) {
          // Create a new guest cart if none exists
          const createResponse = await fetch('/api/carts/guest', { 
            method: 'POST' 
          });
          
          if (createResponse.ok) {
            const newCart = await createResponse.json();
            guestCartId = newCart.id;
            localStorage.setItem('guestCartId', guestCartId);
          } else {
            throw new Error('Failed to create guest cart');
          }
        }
        
        // Add item to guest cart
        const response = await fetch(`/api/carts/guest/${guestCartId}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId, quantity, instructions })
        });

        if (response.ok) {
          const updatedCart = await response.json();
          setCart(updatedCart);
          return updatedCart;
        }
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  // Update item in cart
  const updateCartItem = async (itemDetailId, quantity, instructions) => {
    try {
      if (user) {
        // Logged-in user
        const response = await fetch(`/api/carts/${user.id}/items/${itemDetailId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ quantity, instructions })
        });

        if (response.ok) {
          const updatedCart = await response.json();
          setCart(updatedCart);
          return updatedCart;
        }
      } else {
        // Guest user
        const guestCartId = localStorage.getItem('guestCartId');
        
        if (!guestCartId) {
          throw new Error('No guest cart found');
        }
        
        const response = await fetch(`/api/carts/guest/${guestCartId}/items/${itemDetailId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity, instructions })
        });

        if (response.ok) {
          const updatedCart = await response.json();
          setCart(updatedCart);
          return updatedCart;
        }
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemDetailId) => {
    try {
      if (user) {
        // Logged-in user
        const response = await fetch(`/api/carts/${user.id}/items/${itemDetailId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const updatedCart = await response.json();
          setCart(updatedCart);
          return updatedCart;
        }
      } else {
        // Guest user
        const guestCartId = localStorage.getItem('guestCartId');
        
        if (!guestCartId) {
          throw new Error('No guest cart found');
        }
        
        const response = await fetch(`/api/carts/guest/${guestCartId}/items/${itemDetailId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const updatedCart = await response.json();
          setCart(updatedCart);
          return updatedCart;
        }
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  };

  // Transfer guest cart to user cart after login
  const transferGuestCartToUser = async () => {
    console.log("transferGuestCartToUser called");
    try {
      const guestCartId = localStorage.getItem('guestCartId');
      console.log("guestCartId = ", guestCartId);
      if (!user || !guestCartId) {
        return; // Nothing to transfer
      }
      
      const response = await fetch('/api/carts/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ guestCartId })
      });

      if (response.ok) {
        const result = await response.json();
        setCart(result.cart);
        localStorage.removeItem('guestCartId');
        return result.cart;
      }
    } catch (error) {
      console.error('Error transferring guest cart:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addItemToCart,
      updateCartItem,
      removeCartItem,
      transferGuestCartToUser
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
