import React, { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import AuthLayout from './components/AuthLayout';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import { checkAuthStatus } from './store/slices/authSlice';

const AppRoutes = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Check authentication status on app load
    dispatch(checkAuthStatus());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="form-container">
        <div className="loading" style={{ margin: '2rem auto' }}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
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
            <Dashboard user={user} />
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
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
