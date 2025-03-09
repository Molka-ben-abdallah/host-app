import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../config/firebaseConfig";
import "../../App.css";
import { FirebaseError } from "firebase/app";
import { handleFirebaseError } from "../../utils/firebaseErrorHandler";

const API_BASE_URL = "http://localhost:5000/api/auth";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();

  // Function to check if user exists in DB based on email
  /*const checkUserInDB = async (email: string | null) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/register/${email}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking user:", error);
      return false;
    }
  };*/

  // Email/Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before signing in.");
        setShowErrorModal(true);
        return;
      }

      // Check if user exists in the database based on email
      /* const userExists = await checkUserInDB(user.email);
      if (!userExists) {
        setError("No account found. Please sign up first.");
        setShowErrorModal(true);
        return;
      }*/

      navigate("/profile"); // Redirect to profile if user exists in DB
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Social Sign-In (Google, Facebook)
  const handleSocialSignIn = async (provider: any) => {
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Check if user exists in the database based on email
      /*  const userExists = await checkUserInDB(user.email);
      if (!userExists) {
        setError("No account found. Please sign up first.");
        setShowErrorModal(true);
        return;
      }*/

      navigate("/profile"); // Redirect to profile if user exists in DB
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
        setShowErrorModal(true);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      setShowResetModal(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setShowErrorModal(true);
      }
    }
  };

  return (
    <div className="App">
      <div className="card">
        <h2>Welcome Back!</h2>
        <p>Sign in to continue.</p>

        {/* Sign-In Form */}
        <form onSubmit={handleEmailSignIn}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Forgot Password */}
        <p>
          <button
            className="forgot-password"
            onClick={() => setShowResetModal(true)}
          >
            Forgot Password?
          </button>
        </p>

        <h3>Or sign in with:</h3>
        <div className="social-buttons">
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            className="google-button"
          >
            Sign In with Google
          </button>
          <button
            onClick={() => handleSocialSignIn(facebookProvider)}
            className="facebook-button"
          >
            Sign In with Facebook
          </button>
        </div>

        <p>
          Don't have an account?{" "}
          <a href="/" className="link-style">
            Sign Up
          </a>
        </p>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button onClick={() => setShowErrorModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Reset Password</h2>
            <p>Enter your email to receive a password reset link.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
            />
            <button onClick={handlePasswordReset}>Send Reset Email</button>
            <button onClick={() => setShowResetModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Success Message */}
      {resetSuccess && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Success!</h2>
            <p>
              A password reset email has been sent. Please check your inbox.
            </p>
            <button onClick={() => setResetSuccess(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
