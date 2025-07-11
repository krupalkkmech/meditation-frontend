import React from 'react';

import { Navigate } from 'react-router-dom';

const PublicRoute = ({ user, children }) => {
  if (user) {
    // Redirect to home if user is already authenticated
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PublicRoute;
