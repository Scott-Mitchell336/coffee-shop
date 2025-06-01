const API_BASE_URL = "http://localhost:3000";

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
  const [error, setError] = useState(null);
  const idleTimer = useRef(null);

  const IDLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes

  // Function to handle API requests with optional auth
  const apiRequest = async (
    endpoint,
    method = "GET",
    token = null,
    body = null
  ) => {
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

      const response = await fetch(`/api${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    clearTimeout(idleTimer.current);
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
      } catch (err) {
        console.error("Authentication check failed:", err);
        localStorage.removeItem("token");
        setError("Authentication failed");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [startIdleTimer]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiRequest(
        "/auth/login",
        "POST",
        null,
        credentials
      );
      localStorage.setItem("token", response.token);
      setUser(response.user);
      setError(null);
      startIdleTimer();
      return response.user;
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
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
      setError(null);
      return response;
    } catch (err) {
      setError("Registration failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getToken = () => localStorage.getItem("token");

  const authRequest = async (endpoint, method = "GET", body = null) => {
    const token = getToken();
    if (!token) throw new Error("Authentication required");
    return await apiRequest(endpoint, method, token, body);
  };

  const publicRequest = async (endpoint, method = "GET", body = null) => {
    return await apiRequest(endpoint, method, null, body);
  };

  const value = {
    user,
    loading,
    error,
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
