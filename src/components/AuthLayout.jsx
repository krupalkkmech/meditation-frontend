import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearMessage } from '../store/slices/authSlice';
import Login from './Login';
import Signup from './Signup';

const AuthLayout = () => {
  const dispatch = useAppDispatch();
  const { message } = useAppSelector(state => state.auth);
  const [isLogin, setIsLogin] = useState(true);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const switchToSignup = () => {
    setIsLogin(false);
    dispatch(clearMessage());
  };

  const switchToLogin = () => {
    setIsLogin(true);
    dispatch(clearMessage());
  };

  return (
    <div>
      {message && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '1rem',
            padding: '0.5rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(81, 207, 102, 0.1)',
            color: '#51cf66',
          }}
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
