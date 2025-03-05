import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../config/firebaseConfig";
import "../App.css"; // Importing styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Check if the email is verified
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      navigate("/profile"); // Redirect to the dashboard after successful login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set the error message if login fails
      }
    }
  };

  // Handle authentication with Google or Facebook
  const handleSocialSignIn = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/profile"); // Redirect to the dashboard after successful login
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set the error message if login fails
      }
    }
  };

  return (
    <div className="App">
      <div className="card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}

        {/* Email/Password Login Form */}
        <form onSubmit={handleEmailLogin}>
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
          <button type="submit">Login</button>
        </form>

        <h3>Or Login with:</h3>
        <div className="social-buttons">
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            className="google-button"
          >
            Sign in with Google
          </button>
          <button
            onClick={() => handleSocialSignIn(facebookProvider)}
            className="facebook-button"
          >
            Sign in with Facebook
          </button>
        </div>

        <p>
          <a href="/register" className="link-style">
            Create an account?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
