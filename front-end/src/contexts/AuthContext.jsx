import { createContext, useContext, useState, useEffect } from 'react';
import request from '../api/fetchWrapper';



const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // On mount, try to fetch current user if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const data = await fetchWrapper('/api/auth/me', 'GET', token);
          setUser(data);
        } catch (err) {
          console.error('Invalid token or error fetching user', err);
          logout();
        }
      }
    };
    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    const res = await fetchWrapper('/api/auth/login', 'POST', null, credentials);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    const data = await fetchWrapper('/api/auth/me', 'GET', res.token);
    setUser(data);
  };

  const register = async (credentials) => {
    const res = await fetchWrapper('/api/auth/register', 'POST', null, credentials);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    const data = await fetchWrapper('/api/auth/me', 'GET', res.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
