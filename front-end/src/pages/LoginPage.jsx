import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, error: authError, loading } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      await login(credentials);
      navigate('/menu'); // Redirect after successful login
    } catch (err) {
      console.error('Login error:', err);
      setFormError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      {(formError || authError) && (
        <div className="error">{formError || authError}</div>
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
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;
