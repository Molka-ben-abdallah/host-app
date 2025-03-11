import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/authentification/Profile"; // Import the Profile component
import Home from "./pages/Home";
import ProfilePhoto from "./pages/ProfilePhoto";
import SignUp from "./components/authentification/SignUp";
import SignIn from "./components/authentification/SignIn";
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
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/profile-information" element={<Home />} />
        <Route path="/profile-photo" element={<ProfilePhoto />} />
      </Routes>
    </Router>
  );
}

export default App;
