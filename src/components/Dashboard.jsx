import React from 'react';

import { useAppSelector } from '../hooks/redux';

const Dashboard = ({ user }) => {
  const { user: currentUser } = useAppSelector(state => state.auth);

  return (
    <div className="form-container">
      <h2 className="form-title">
        Welcome, {currentUser?.name || user?.name}!
      </h2>
      <div style={{ marginTop: '2rem' }}>
        <p>Email: {currentUser?.email || user?.email}</p>
        <p>User ID: {currentUser?.id || user?.id}</p>
        <p>This is your dashboard page.</p>
      </div>
    </div>
  );
};

export default Dashboard;
