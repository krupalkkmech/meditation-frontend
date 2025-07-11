import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearError, loginUser } from '../store/slices/authSlice';

const Login = ({ onSwitchToSignup }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear Redux error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    dispatch(loginUser(formData));
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
            disabled={loading}
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
            disabled={loading}
          />
          {errors.password && (
            <div className="form-error">{errors.password}</div>
          )}
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="form-button" disabled={loading}>
          {loading ? (
            <>
              <span className="loading"></span>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>
      </form>

      <div className="form-switch">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup}>
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
