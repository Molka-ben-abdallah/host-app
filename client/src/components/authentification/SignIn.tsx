import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "../../App.css"; // Importing styles

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
      if (!userCredential.user.emailVerified) {
        setError("Please verify your email before signing in.");
        setShowErrorModal(true);
        return;
      }
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setShowErrorModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle social login
  const handleSocialSignIn = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setShowErrorModal(true);
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
          <a href="/signup" className="link-style">
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
