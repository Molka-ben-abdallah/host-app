import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../config/firebaseConfig";
import "../App.css"; // Importing styles

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle authentication with Google or Facebook
  const handleSocialSignIn = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/profile"); // Redirect to the profile/dashboard after successful registration
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set the error message if registration fails
      }
    }
  };

  // Email/Password Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/login"); // Redirect to the login page after successful registration
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set the error message if registration fails
      }
    }
  };

  return (
    <div className="App">
      <div className="card">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}

        {/* Email/Password Registration Form */}
        <form onSubmit={handleRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          <a href="/login" className="link-style">
            Already have an account?
          </a>
        </p>
        <h3>Or Register with:</h3>
        <div className="social-buttons">
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            className="google-button"
          >
            Register with Google
          </button>
          <button
            onClick={() => handleSocialSignIn(facebookProvider)}
            className="facebook-button"
          >
            Register with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
