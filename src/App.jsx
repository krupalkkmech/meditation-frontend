import React, { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import { Box, CircularProgress, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import About from './components/About';
import AuthLayout from './components/AuthLayout';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import InstallPrompt from './components/InstallPrompt';
import Pricing from './components/Pricing';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuthStatus } from './store/slices/authSlice';
import { theme } from './theme/theme';

// Component to manage body class
const BodyClassManager = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/auth') {
      document.body.classList.add('auth-page');
    } else {
      document.body.classList.remove('auth-page');
    }
  }, [location.pathname]);

  return null;
};

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Check authentication status on app load
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return (
      <>
        <Header />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 64px)',
            gap: 2,
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary">
            Loading TimeFlow...
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public routes - redirect to dashboard if authenticated */}
          <Route
            path="/auth"
            element={
              <PublicRoute user={user}>
                <AuthLayout />
              </PublicRoute>
            }
          />

          {/* Protected routes - redirect to auth if not authenticated */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pricing"
            element={
              <ProtectedRoute user={user}>
                <Pricing />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute user={user}>
                <About />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Catch all - redirect to appropriate page */}
          <Route
            path="*"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Routes>
      </Box>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <BodyClassManager />
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
