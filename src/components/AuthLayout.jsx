import React, { useState } from 'react';

import { useAppDispatch } from '../hooks/redux';
import { clearError } from '../store/slices/authSlice';
import Login from './Login';
import Signup from './Signup';

const AuthLayout = () => {
  const dispatch = useAppDispatch();
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => {
    setIsLogin(false);
    dispatch(clearError());
  };

  const switchToLogin = () => {
    setIsLogin(true);
    dispatch(clearError());
  };

  return (
    <div>
      {isLogin ? (
        <Login onSwitchToSignup={switchToSignup} />
      ) : (
        <Signup onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthLayout;
