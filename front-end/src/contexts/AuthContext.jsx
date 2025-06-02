const API_BASE_URL = "http://localhost:3000";

import { cartApi } from "../api/api";
import { getGuestCartId, clearGuestCartId } from "../utils/cart";
import { useNavigate, Link } from 'react-router-dom';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const idleTimer = useRef(null);
  //const navigate = useNavigate();

  const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  // Function to handle API requests with optional auth
  const apiRequest = useCallback(
    async (endpoint, method = "GET", token = null, body = null) => {
      console.log(`API Request: ${method} ${endpoint}`, { token, body });
      try {
        const headers = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const options = { method, headers };

        if (body && (method === "POST" || method === "PUT")) {
          options.body = JSON.stringify(body);
        }

        console.log(`Making request to: ${API_BASE_URL}/api${endpoint}`);
        const url = `${API_BASE_URL}/api${endpoint}`;
        const response = await fetch(url, options);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Request failed");
        }

        return await response.json();
      } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
      }
    },
    []
  );

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  const authRequest = useCallback(
    async (endpoint, method = "GET", body = null) => {
      const token = getToken();
      if (!token) throw new Error("Authentication required");
      return await apiRequest(endpoint, method, token, body);
    },
    [apiRequest, getToken]
  );

  const publicRequest = useCallback(
    async (endpoint, method = "GET", body = null) => {
      return await apiRequest(endpoint, method, null, body);
    },
    [apiRequest]
  );

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    clearTimeout(idleTimer.current);
    //navigate('/');
    window.location.href = '/';
    console.log("Logged out due to inactivity or user action");
  }, []);

  // Start idle timer
  const startIdleTimer = useCallback(() => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(logout, IDLE_TIMEOUT);
  }, [logout]);

  // Reset idle timer on activity
  const resetIdleTimer = useCallback(() => {
    if (user) startIdleTimer();
  }, [user, startIdleTimer]);

  // Event listeners for activity tracking
  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
      clearTimeout(idleTimer.current);
    };
  }, [resetIdleTimer]);

  // Wrap transferGuestCart in useCallback with proper dependencies
  // First create a reference to the function to fix the circular dependency
  const transferGuestCartRef = useRef(null);

  // Check auth status once on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const userData = await apiRequest("/auth/me", "GET", token);
        setUser(userData);
        startIdleTimer();

        // Optional: Now that we have user data, we could call transferGuestCart
        // But only if the function is defined
        if (transferGuestCartRef.current) {
          transferGuestCartRef.current();
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        localStorage.removeItem("token");
        setAuthError("Authentication failed");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [apiRequest, startIdleTimer]);

  // Define transferGuestCart and store in ref to avoid circular dependency
  const transferGuestCart = useCallback(async () => {
    const guestCartId = getGuestCartId();
    if (guestCartId && user) {
      try {
        await cartApi.transferGuestCart(authRequest, guestCartId);
        // Clear the guest cart ID after transfer
        clearGuestCartId();
      } catch (error) {
        console.error("Failed to transfer guest cart:", error);
      }
    }
  }, [user, authRequest]);

  // Store the latest version of transferGuestCart in the ref
  transferGuestCartRef.current = transferGuestCart;

  // Use the function in a separate useEffect
  useEffect(() => {
    if (user) {
      transferGuestCart();
    }
  }, [user, transferGuestCart]);

  // Login and register functions
  const login = useCallback(
    async (credentials) => {
      console.log("login called with credentials:", credentials);
      setLoading(true);
      try {
        const response = await apiRequest(
          "/auth/login",
          "POST",
          null,
          credentials
        );
        localStorage.setItem("token", response.token);
        console.log("response = ", response);
        // After getting token, fetch the user data
        const userData = await apiRequest("/auth/me", "GET", response.token);
        console.log("userData = ", userData);
        setUser(userData);
        setAuthError(null);
        startIdleTimer();
        return userData;
      } catch (err) {
        setAuthError("Login failed. Please check your credentials.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, startIdleTimer]
  );

  const register = useCallback(
    async (userData) => {
      setLoading(true);
      try {
        const response = await apiRequest(
          "/auth/register",
          "POST",
          null,
          userData
        );
        if (response.token) {
          localStorage.setItem("token", response.token);
          setUser(response.user);
          startIdleTimer();
        }
        setAuthError(null);
        return response;
      } catch (err) {
        setAuthError("Registration failed.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest, startIdleTimer]
  );

  const value = {
    user,
    loading,
    authError,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    authRequest,
    publicRequest,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
