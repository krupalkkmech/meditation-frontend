import React, { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearMessage } from '../store/slices/authSlice';

const Dashboard = ({ user }) => {
  const dispatch = useAppDispatch();
  const { message } = useAppSelector(state => state.auth);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  return (
    <div className="form-container">
      <h2 className="form-title">Welcome, {user.name}!</h2>
      {message && <div className="form-success">{message}</div>}
      <div style={{ marginTop: '2rem' }}>
        <p>Email: {user.email}</p>
        <p>User ID: {user.id}</p>
        <p>This is your dashboard page.</p>
      </div>
    </div>
  );
};

export default Dashboard;
