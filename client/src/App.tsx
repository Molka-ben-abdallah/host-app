import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/authentification/Profile"; // Import the Profile component
import ProfileInfo from "./pages/ProfileInfo";
import ProfilePhoto from "./pages/ProfilePhoto";
import SignUp from "./components/authentification/SignUp";
import SignIn from "./components/authentification/SignIn";
import Landing from "./pages/Landing";
import Location from "./pages/Location";
import Passions from "./pages/Passions";
import Languages from "./pages/Languages";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-information"
          element={
            <ProtectedRoute>
              <ProfileInfo />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile-photo"
          element={
            <ProtectedRoute>
              <ProfilePhoto />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <Location />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/languages"
          element={
            <ProtectedRoute>
              <Languages />{" "}
            </ProtectedRoute>
          }
        />{" "}
        <Route
          path="/passions"
          element={
            <ProtectedRoute>
              <Passions />{" "}
            </ProtectedRoute>
          }
        />
        <Route path="/landing" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
