import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loadingUser } = useApp();

  // If user state is still loading from the API, show a loading placeholder
  if (loadingUser) {
    return (
      <div className="bg-background text-on-surface min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route is admin-only and the authenticated user is not an admin, redirect to home page
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child route components
  return <Outlet />;
};

export default ProtectedRoute;
