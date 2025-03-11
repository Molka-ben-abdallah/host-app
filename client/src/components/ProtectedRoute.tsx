// components/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  // If no user is logged in, redirect to the auth page
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, allow access to the protected route
  return <>{children}</>;
};

export default ProtectedRoute;
