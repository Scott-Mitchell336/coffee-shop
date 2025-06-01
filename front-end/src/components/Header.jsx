import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  console.log('Header user:', user);

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', alignItems: 'center', margin: 0, padding: 0 }}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/menu">Menu</Link></li>
        {user ? (
          <>
            <li style={{ marginLeft: 'auto' }}>Hello, {user.username}!</li>
            <li>
              <button 
                onClick={logout} 
                style={{ 
                  cursor: 'pointer', 
                  padding: '0.3rem 0.7rem', 
                  backgroundColor: '#f44336', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '4px' 
                }}
                aria-label="Logout"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li style={{ marginLeft: 'auto' }}><Link to="/login">Login</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
          </>
        )}
        <li><Link to="/order">Order</Link></li>
        <li><Link to="/cart">Cart</Link></li>
      </ul>
    </nav>
  );
};

export default Header;
