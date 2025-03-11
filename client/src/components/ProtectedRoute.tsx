import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser } = useAuth();

  // If no user is logged in, redirect to the sign-in page
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // If the user is logged in, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;
