import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/authentification/Register"; // Import the Register component
import Login from "./components/authentification/Login"; // Import the Login component
import Logout from "./components/authentification/Logout"; // Import the Logout component
import Profile from "./components/authentification/Profile"; // Import the Profile component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
