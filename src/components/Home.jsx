import React from 'react';

import { useAppSelector } from '../hooks/redux';

const Home = () => {
  const { user } = useAppSelector(state => state.auth);

  return (
    <div className="home-container">
      <main className="home-main">
        <section className="hero-section">
          <h2>Welcome to Your Meditation Journey</h2>
          <p>
            Find your inner peace and cultivate mindfulness in your daily life
          </p>
        </section>

        <section className="user-details">
          <h3>Your Wellness Profile</h3>
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
                <strong>Member ID:</strong> {user?.id}
              </p>
            </div>
          </div>
        </section>

        <section className="features-section">
          <h3>Meditation Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🧘 Guided Sessions</h4>
              <p>
                Access hundreds of guided meditation sessions for all experience
                levels
              </p>
            </div>
            <div className="feature-card">
              <h4>🎵 Ambient Sounds</h4>
              <p>
                Immerse yourself in calming nature sounds and peaceful music
              </p>
            </div>
            <div className="feature-card">
              <h4>📊 Progress Tracking</h4>
              <p>
                Monitor your meditation journey with detailed progress insights
              </p>
            </div>
            <div className="feature-card">
              <h4>⏰ Daily Reminders</h4>
              <p>
                Set gentle reminders to maintain your daily meditation practice
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
