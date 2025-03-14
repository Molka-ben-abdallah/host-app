import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

// Define the shape of the context
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
});

// Create the provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe; // Cleanup function
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
