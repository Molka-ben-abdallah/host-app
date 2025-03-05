import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // Firebase config import

const Profile = () => {
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      navigate("/login"); // Redirect to the login page after logout
    } catch (err) {
      console.error("Error signing out: ", err);
    }
  };

  return (
    <div className="App">
      <div className="card">
        <h2>Welcome to Your Profile</h2>
        <p>You're logged in as {auth.currentUser?.email}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;
