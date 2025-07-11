import React from 'react';

import { Navigate } from 'react-router-dom';

const PublicRoute = ({ user, children }) => {
  if (user) {
    // Redirect to dashboard if user is already authenticated
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
