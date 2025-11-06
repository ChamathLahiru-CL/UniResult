import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // If there's no user, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If a role is required and user doesn't have it, redirect to login
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
