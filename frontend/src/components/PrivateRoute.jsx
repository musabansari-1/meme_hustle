import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center text-white text-xl p-8">Loading authentication...</div>; // Or a more elaborate loading spinner
  }

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute; 