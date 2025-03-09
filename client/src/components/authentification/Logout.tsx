import React, { useState } from "react";
import "../../App.css"; // Importing styles
import { Navigate } from "react-router-dom";

const Logout = () => {
  const [redirect, setRedirect] = useState(false);

  const handleLogout = () => {
    // Set state to trigger the redirect
    setRedirect(true);
  };

  // If the user is logged out, redirect them to the login page
  if (redirect) {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="App">
      <div className="card">
        <h2>Logged Out</h2>
        <p>You have successfully logged out. Thank you for using the app!</p>
        <button onClick={handleLogout}>Go Back to Login</button>
      </div>
    </div>
  );
};

export default Logout;
