// App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext"; // Import useAuth
import Profile from "./pages/Profile";
import ProfileInfo from "./pages/ProfileInfo";
import ProfilePhoto from "./pages/ProfilePhoto";
import Landing from "./pages/Landing";
import Location from "./pages/Location";
import Passions from "./pages/Passions";
import Languages from "./pages/Languages";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";
import Overview from "./pages/Overview";

function App() {
  const { currentUser } = useAuth(); // Get the current user from the auth context

  return (
    <Router>
      <Routes>
        {/* Redirect to /profile if the user is already logged in */}
        <Route
          path="/"
          element={
            currentUser ? <Navigate to="/profile" replace /> : <AuthPage />
          }
        />
        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-information"
          element={
            <ProtectedRoute>
              <ProfileInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-photo"
          element={
            <ProtectedRoute>
              <ProfilePhoto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <Location />
            </ProtectedRoute>
          }
        />
        <Route
          path="/languages"
          element={
            <ProtectedRoute>
              <Languages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/passions"
          element={
            <ProtectedRoute>
              <Passions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          }
        />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
