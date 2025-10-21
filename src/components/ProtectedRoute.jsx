import React from 'react';

// DEVELOPMENT: Simple pass-through component for testing
const ProtectedRoute = ({ children }) => {
  // Just return the children without any authentication
  return children;
};

export default ProtectedRoute;
