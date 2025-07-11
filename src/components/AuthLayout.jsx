import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearError, clearMessage } from '../store/slices/authSlice';
import Login from './Login';
import Signup from './Signup';

const AuthLayout = () => {
  const dispatch = useAppDispatch();
  const { message } = useAppSelector(state => state.auth);
  const [isLogin, setIsLogin] = useState(true);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const switchToSignup = () => {
    setIsLogin(false);
    dispatch(clearError());
    dispatch(clearMessage());
  };

  const switchToLogin = () => {
    setIsLogin(true);
    dispatch(clearError());
    dispatch(clearMessage());
  };

  return (
    <div>
      {/* Global success message */}
      {message && (
        <div
          className="form-success"
          style={{ marginBottom: '1rem', textAlign: 'center' }}
        >
          {message}
        </div>
      )}

      {isLogin ? (
        <Login onSwitchToSignup={switchToSignup} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthLayout;
