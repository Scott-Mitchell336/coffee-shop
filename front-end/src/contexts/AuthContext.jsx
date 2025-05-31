import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle API requests with optional auth
  const apiRequest = async (endpoint, method = 'GET', token = null, body = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      // Only add auth token if provided
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const options = {
        method,
        headers
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`/api${endpoint}`, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  };

  // Check if user is logged in (only on initial load)
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          // No token found, user is not authenticated
          setLoading(false);
          return;
        }
        
        // Check if token is valid and get user data
        const userData = await apiRequest('/auth/me', 'GET', token);
        setUser(userData);
      } catch (err) {
        // Token invalid or expired, clear it
        console.error('Authentication check failed:', err);
        localStorage.removeItem('token');
        setError('Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await apiRequest('/auth/login', 'POST', null, credentials);
      
      // Save token in localStorage
      localStorage.setItem('token', response.token);
      
      // Set user data
      setUser(response.user);
      setError(null);
      
      return response.user;
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await apiRequest('/auth/register', 'POST', null, userData);
      
      // Save token if registration also logs in the user
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
      }
      
      setError(null);
      return response;
    } catch (err) {
      setError('Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Get current auth token
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // Function to make authenticated requests
  const authRequest = async (endpoint, method = 'GET', body = null) => {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    return await apiRequest(endpoint, method, token, body);
  };

  // Function to make public requests (no auth)
  const publicRequest = async (endpoint, method = 'GET', body = null) => {
    return await apiRequest(endpoint, method, null, body);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    authRequest, // For protected routes
    publicRequest, // For public routes
    getToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
