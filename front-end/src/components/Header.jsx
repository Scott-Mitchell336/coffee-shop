/*
Top nav with logo and site name
Navigation links (Home, Menu, About, Order)
*/
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Coffee Shop</Link>
      </div>
      <nav className="nav-menu">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          {isAuthenticated && user.role === 'administrator' && (
            <li><Link to="/menu/add">Add Menu Item</Link></li>
          )}
        </ul>
      </nav>
      <div className="auth-section">
        {isAuthenticated ? (
          <div className="user-menu">
            <span>Hello, {user.username}</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/register" className="register-link">Register</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
