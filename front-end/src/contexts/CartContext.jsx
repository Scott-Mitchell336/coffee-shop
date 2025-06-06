import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth
import { cartApi } from '../api/api'; // Import the cartApi functions
import { saveGuestCartId } from "../utils/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, authRequest, publicRequest } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const firstRenderRef = useRef(true);

  // Get or create appropriate cart on component mount or when user changes
  useEffect(() => {
    if (!firstRenderRef.current) {
      // Skip the effect on first render
      return;
    }

    firstRenderRef.current = false;

    const currentAuthRequest = authRequest; 
    const currentPublicRequest = publicRequest;
    
    const fetchCart = async () => {
      console.log("fetchCart called at:", new Date().toISOString());
      setLoading(true);
      try {
        if (user) {
          // Logged-in user: get their cart
          try {
            console.log("Fetching cart for user:", user.id);
            const cartData = await cartApi.getUserCart(currentAuthRequest, user.id);
            setCart(cartData);
          } catch (error) {
            if (error.status === 404) {
              console.log("Cart not found for user.id:", user.id);
              setCart(null);
            } else {
              throw error;
            }
          }
        } else {
          // Guest user: get or create guest cart
          let guestCartId = localStorage.getItem('guestCartId');
          
          if (guestCartId) {
            // Try to fetch existing guest cart
            try {
              const cartData = await cartApi.getGuestCart(currentPublicRequest, guestCartId);
              setCart(cartData);
            } catch (error) {
              // Guest cart not found or expired, remove from localStorage
              localStorage.removeItem('guestCartId');
              setCart(null);
            }
          } else {
            // No guest cart yet, that's okay
            const newCart = await cartApi.createGuestCart(publicRequest);
            const cartId = newCart.id;
            saveGuestCartId(cartId);
            setCart(newCart);
          }
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user, authRequest, publicRequest]);

  // Add item to cart
  const addItemToCart = async (itemId, quantity = 1, instructions = '') => {
    
    console.log("addItemToCart called with:", { itemId, quantity, instructions });
    try {
      console.log("Adding item to cart:", { itemId, quantity, instructions });
      console.log("Current user:", user);
      if (user) {
        // Logged-in user
        const updatedCart = await cartApi.addItemToCart(
          authRequest, 
          user.id, 
          { itemId, quantity, instructions }
        );
        setCart(updatedCart);
        return updatedCart;
      } else {
        // Guest user
        let guestCartId = localStorage.getItem('guestCartId');
        console.log("Guest cart ID:", guestCartId);
        
        if (!guestCartId) {
          // Create a new guest cart if none exists
          const newCart = await cartApi.createGuestCart(publicRequest);
          guestCartId = newCart.id;
          localStorage.setItem('guestCartId', guestCartId);
        }
        
        // Add item to guest cart
        const updatedCart = await cartApi.addItemToGuestCart(
          publicRequest, 
          guestCartId, 
          { itemId, quantity, instructions }
        );
        setCart(updatedCart);
        return updatedCart;
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
        const updatedCart = await cartApi.updateCartItem(
          authRequest,
          user.id,
          itemDetailId,
          { quantity, instructions }
        );
        setCart(updatedCart);
        return updatedCart;
      } else {
        // Guest user
        const guestCartId = localStorage.getItem('guestCartId');
        
        if (!guestCartId) {
          throw new Error('No guest cart found');
        }
        
        const updatedCart = await cartApi.updateGuestCartItem(
          publicRequest,
          guestCartId,
          itemDetailId,
          { quantity, instructions }
        );
        setCart(updatedCart);
        return updatedCart;
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
        const updatedCart = await cartApi.removeCartItem(
          authRequest,
          user.id,
          itemDetailId
        );
        setCart(updatedCart);
        return updatedCart;
      } else {
        // Guest user
        const guestCartId = localStorage.getItem('guestCartId');
        
        if (!guestCartId) {
          throw new Error('No guest cart found');
        }
        
        const updatedCart = await cartApi.removeGuestCartItem(
          publicRequest,
          guestCartId,
          itemDetailId
        );
        setCart(updatedCart);
        return updatedCart;
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  };

  // Transfer guest cart to user cart after login
  /*const transferGuestCartToUser = async () => {
    console.log("transferGuestCartToUser called");
    try {
      const guestCartId = localStorage.getItem('guestCartId');
      console.log("guestCartId = ", guestCartId);
      
      if (!user || !guestCartId) {
        return; // Nothing to transfer
      }
      
      const result = await cartApi.transferGuestCart(
        authRequest,
        guestCartId
      );
      
      setCart(result.cart);
      localStorage.removeItem('guestCartId');
      return result.cart;
    } catch (error) {
      console.error('Error transferring guest cart:', error);
      throw error;
    }
  };*/

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addItemToCart,
      updateCartItem,
      removeCartItem
      //transferGuestCartToUser
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
