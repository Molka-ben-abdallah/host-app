import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth"; // Firebase auth listener
import { auth } from "./config/firebaseConfig"; // Firebase config import
import Register from "./components/Register"; // Import the Register component
import Login from "./components/Login"; // Import the Login component
import Logout from "./components/Logout";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState<any>(null); // Track user state

  useEffect(() => {
    // Check if the user is authenticated
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user state accordingly
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  // Protected Route that redirects to login if user is not authenticated
  const PrivateRoute = ({ element }: any) => {
    if (user) {
      return element;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />

        {/* Protected Profile route */}
        <Route
          path="/profile"
          element={<PrivateRoute element={<Profile />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
