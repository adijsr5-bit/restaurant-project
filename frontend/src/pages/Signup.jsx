import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/signup', { email, password });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/'); // Redirect user to home
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="text-muted text-center mb-4">Join our fine dining community.</p>
        <div className="divider mx-auto mb-4"></div>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="input-field luxury-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input-field luxury-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary full-width mt-4" disabled={loading}>
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center mt-4" style={{ fontSize: '0.9rem' }}>
          Already have an account? <a href="/login" style={{ color: 'var(--primary-color)' }}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
