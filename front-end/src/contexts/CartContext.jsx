import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext"; // Import useAuth
import { cartApi } from "../api/api"; // Import the cartApi functions
import { saveGuestCartId } from "../utils/cart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, authRequest, publicRequest } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchInProgressRef = useRef(false); // Track if fetch is in progress
  const prevUserRef = useRef(null); // Track previous user to detect changes

  // Get or create appropriate cart on component mount or when user changes
  useEffect(() => {
    // Skip if a fetch is already in progress
    if (fetchInProgressRef.current) {
      return;
    }

    // Check if the user has changed (login/logout)
    const userChanged = prevUserRef.current !== user?.id;
    prevUserRef.current = user?.id;

    const currentAuthRequest = authRequest;
    const currentPublicRequest = publicRequest;

    const fetchCart = async () => {
      console.log(
        `fetchCart called at: ${new Date().toISOString()} for user: ${
          user?.id || "guest"
        }`
      );

      // Set fetch in progress to prevent concurrent calls
      fetchInProgressRef.current = true;
      setLoading(true);

      try {
        if (user) {
          // Logged-in user: get their cart
          try {
            console.log("Fetching cart for user:", user.id);
            const cartData = await cartApi.getUserCart(
              currentAuthRequest,
              user.id
            );
            setCart(cartData);
          } catch (error) {
            // Log the full error object to see its structure
            console.log("Error fetching user cart:", error);

            // Check for status code in different possible locations
            const statusCode = error.status || error.response?.status || error.statusCode;
            console.log("Extracted status code:", statusCode);

            if (statusCode === 404) {
              console.log("Cart not found for user.id:", user.id);
              setCart(null);
            } else {
              // For other errors, you might want to show an error message
              console.error("Failed to fetch cart:", error);
              // Uncomment if you want to re-throw the error
              // throw error;
            }
          }
        } else {
          // Guest user: get or create guest cart
          let guestCartId = null;
          try {
            guestCartId = localStorage.getItem("guestCartId");
            console.log(
              "Retrieved guestCartId from localStorage:",
              guestCartId
            );
          } catch (storageError) {
            console.error("Error accessing localStorage:", storageError);
          }

          if (guestCartId) {
            // Try to fetch existing guest cart
            try {
              const cartData = await cartApi.getGuestCart(
                currentPublicRequest,
                guestCartId
              );
              setCart(cartData);
            } catch (error) {
              console.error("Error fetching guest cart:", error);
              console.log("Removing invalid guestCartId from localStorage");
              try {
                localStorage.removeItem("guestCartId");
              } catch (removeError) {
                console.error(
                  "Error removing guestCartId from localStorage:",
                  removeError
                );
              }
              setCart(null);
            }
          } else {
            console.log("No guestCartId found, creating new cart");
            try {
              const newCart = await cartApi.createGuestCart(publicRequest);
              const cartId = newCart.id;
              saveGuestCartId(cartId);
              setCart(newCart);
            } catch (createError) {
              console.error("Error creating guest cart:", createError);
              setCart(null);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
        fetchInProgressRef.current = false;
      }
    };

    // Only fetch on first render or when user changes
    if (userChanged) {
      fetchCart();
    }
  }, [user, authRequest, publicRequest]);

  // Enable manual cart refresh
  const refreshCart = useCallback(async () => {
    if (fetchInProgressRef.current) {
      console.log("Cart refresh already in progress");
      return;
    }

    console.log("Manual cart refresh requested");

    if (!user && !localStorage.getItem("guestCartId")) {
      console.log("No user or guest cart to refresh");
      return;
    }

    fetchInProgressRef.current = true;
    setLoading(true);

    try {
      if (user) {
        const cartData = await cartApi.getUserCart(authRequest, user.id);
        setCart(cartData);
      } else {
        const guestCartId = localStorage.getItem("guestCartId");
        if (guestCartId) {
          const cartData = await cartApi.getGuestCart(
            publicRequest,
            guestCartId
          );
          setCart(cartData);
        }
      }
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setLoading(false);
      fetchInProgressRef.current = false;
    }
  }, [user, authRequest, publicRequest]); // Add proper dependencies

  // Add item to cart
  const addItemToCart = async (itemId, quantity = 1, instructions = "") => {
    console.log("addItemToCart called with:", {
      itemId,
      quantity,
      instructions,
    });
    try {
      console.log("Adding item to cart:", { itemId, quantity, instructions });
      console.log("Current user:", user);
      if (user) {
        // Logged-in user
        const updatedCart = await cartApi.addItemToCart(authRequest, user.id, {
          itemId,
          quantity,
          instructions,
        });
        setCart(updatedCart);
        console.log("[CartContext] Cart after adding item:", updatedCart);
        return updatedCart;
      } else {
        // Guest user
        let guestCartId = localStorage.getItem("guestCartId");
        console.log("Guest cart ID:", guestCartId);

        if (!guestCartId) {
          // Create a new guest cart if none exists
          const newCart = await cartApi.createGuestCart(publicRequest);
          guestCartId = newCart.id;
          localStorage.setItem("guestCartId", guestCartId);
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
      console.error("Error adding item to cart:", error);
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
        const guestCartId = localStorage.getItem("guestCartId");

        if (!guestCartId) {
          throw new Error("No guest cart found");
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
      console.error("Error updating cart item:", error);
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
        const guestCartId = localStorage.getItem("guestCartId");

        if (!guestCartId) {
          throw new Error("No guest cart found");
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
      console.error("Error removing cart item:", error);
      throw error;
    }
  };

  // Complete cart (mark as finished/paid)
  const completeCart = async () => {
    try {
      if (user) {
        // User cart - first need to get the active cart ID
        if (!cart || !cart.id) {
          throw new Error("No active cart found to complete");
        }

        console.log(`Completing user cart with ID: ${cart.id}`);
        const completedCart = await cartApi.completeCartById(
          authRequest,
          cart.id
        );
        setCart(null); // Clear the current cart after completion
        return completedCart;
      } else {
        // Guest cart
        const guestCartId = localStorage.getItem("guestCartId");

        if (!guestCartId) {
          throw new Error("No guest cart found to complete");
        }

        console.log(`Completing guest cart with ID: ${guestCartId}`);
        const completedCart = await cartApi.completeGuestCartById(
          publicRequest,
          guestCartId
        );

        // Clear the guest cart ID from localStorage after completion
        localStorage.removeItem("guestCartId");
        setCart(null); // Clear the current cart
        return completedCart;
      }
    } catch (error) {
      console.error("Error completing cart:", error);
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
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItemToCart,
        updateCartItem,
        removeCartItem,
        refreshCart, // Export this new function
        completeCart,
        cartCount:
          cart?.cart_items
            ?.flatMap((ci) => ci.cart_item_details)
            ?.reduce((sum, detail) => sum + (detail.quantity || 0), 0) || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
