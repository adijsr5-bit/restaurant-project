import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.role?.toLowerCase() !== 'admin') {
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
