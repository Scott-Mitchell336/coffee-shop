import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

function LoginPage() {
  const { login, loading, setUser} = useAuth();
  const navigate = useNavigate();
  //const { useCart } = useCart();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState('');

  // Get the cart context with a null check
  const cart = useCart();
  //const transferGuestCartToUser = cart?.transferGuestCartToUser;

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    console.log("handleSubmit called");
      
    try {
      const data = await login(credentials);
      console.log("data = ", data);

      
      // Transfer any guest cart to the user's account
      //await transferGuestCartToUser();
      
      console.log("naviagting to /menu");
      navigate('/menu');
    } catch (err) {
      setFormError('Invalid username or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {(formError || formError) && (
        <div className="error">{formError || formError}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="auth-links">
        <p>Don't have an account? <Link to="/register">Sign up</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;
