import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/authentification/Profile"; // Import the Profile component
import Home from "./pages/Home";
import ProfilePhoto from "./pages/ProfilePhoto";
import SignUp from "./components/authentification/SignUp";
import SignIn from "./components/authentification/SignIn";
import Landing from "./pages/Landing";
import Location from "./pages/Location";
import Passions from "./pages/Passions";
import Languages from "./pages/Languages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile-information" element={<Home />} />
        <Route path="/profile-photo" element={<ProfilePhoto />} />
        <Route path="/location" element={<Location />} />
        <Route path="/languages" element={<Languages />} />
        <Route path="/passions" element={<Passions />} />
        <Route path="/landing" element={<Landing/>} />
      </Routes>
    </Router>
  );
}

export default App;
