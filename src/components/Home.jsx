import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearMessage, logoutUser } from '../store/slices/authSlice';

const Home = () => {
  const dispatch = useAppDispatch();
  const { user, message } = useAppSelector(state => state.auth);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Hackathod</h1>
        <div className="user-info">
          <span>Hello, {user?.name}!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {message && <div className="form-success">{message}</div>}

      <main className="home-main">
        <section className="hero-section">
          <h2>Your Dashboard</h2>
          <p>You're successfully logged in and ready to explore!</p>
        </section>

        <section className="user-details">
          <h3>Account Information</h3>
          <div className="user-card">
            <div className="user-avatar">
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-details-info">
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>User ID:</strong> {user?.id}
              </p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h3>What's New</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🚀 Quick Start</h4>
              <p>Get started with your first project</p>
            </div>
            <div className="feature-card">
              <h4>📊 Analytics</h4>
              <p>View your project statistics</p>
            </div>
            <div className="feature-card">
              <h4>⚙️ Settings</h4>
              <p>Manage your account preferences</p>
            </div>
            <div className="feature-card">
              <h4>📝 Projects</h4>
              <p>Create and manage your projects</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
