import React, { useEffect } from 'react';

import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import About from './components/About';
import AuthLayout from './components/AuthLayout';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Home from './components/Home';
import InstallPrompt from './components/InstallPrompt';
import Pricing from './components/Pricing';
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
      <>
        <Header />
        <div className="main-content">
          <div className="form-container">
            <div className="loading" style={{ margin: '2rem auto' }}></div>
            <p>Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="main-content">
        <Routes>
          {/* Public routes - redirect to home if authenticated */}
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
            path="/home"
            element={
              <ProtectedRoute user={user}>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user}>
                <Dashboard user={user} />
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
                <Navigate to="/home" replace />
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
                <Navigate to="/home" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
        </Routes>
      </div>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </>
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
