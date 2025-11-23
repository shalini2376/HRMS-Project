// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  const token = localStorage.getItem('token');

  if (!token) {
    // not logged in → go to login
    return <Navigate to="/login" replace />;
  }

  // logged in → show nested routes
  return <Outlet />;
}

export default ProtectedRoute;
