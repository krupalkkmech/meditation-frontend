import React, { useEffect, useState } from 'react';

import { Alert, Box, Container, Paper } from '@mui/material';

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
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 3,
            backgroundColor: 'background.paper',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        >
          {/* Global success message */}
          {message && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => dispatch(clearMessage())}
            >
              {message}
            </Alert>
          )}

          {isLogin ? (
            <Login onSwitchToSignup={switchToSignup} />
          ) : (
            <Signup onSwitchToLogin={switchToLogin} />
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
