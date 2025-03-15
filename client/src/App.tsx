import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
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
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            currentUser && currentUser.emailVerified ? (
              <Navigate to="/profile" />
            ) : (
              <AuthPage />
            )
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

        {/* Landing Page (Could be a public page) */}
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
