import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/authentification/SignUp"; // Import the Register component
import Profile from "./components/authentification/Profile"; // Import the Profile component
import SignIn from "./components/authentification/SignIn";
import SignUp from "./components/authentification/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
