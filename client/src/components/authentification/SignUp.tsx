import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../config/firebaseConfig";
import "../../App.css"; // Importing styles

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for pop-up
  const navigate = useNavigate();

  // Handle authentication with Google or Facebook
  const handleSocialSignIn = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  // Email/Password Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      // Show the pop-up modal
      setShowModal(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Close the pop-up and redirect to login
  const closeModal = () => {
    setShowModal(false);
    navigate("/signin");
  };

  return (
    <div className="App">
      <div className="card">
        <h2>Create Your Account</h2>
        <p>Join us and start your journey!</p>

        {error && <p className="error-message">{error}</p>}

        {/* Sign-Up Form */}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <h3>Or sign up with:</h3>
        <div className="social-buttons">
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            className="google-button"
          >
            Sign Up with Google
          </button>
          <button
            onClick={() => handleSocialSignIn(facebookProvider)}
            className="facebook-button"
          >
            Sign Up with Facebook
          </button>
        </div>

        <p>
          Already have an account?{" "}
          <a href="/signin" className="link-style">
            Log in
          </a>
        </p>
      </div>

      {/* Modal Pop-up */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Almost there!</h2>
            <p>
              We've sent a verification email to <b>{email}</b>. Please check
              your inbox and click the link to activate your account.
            </p>
            <button onClick={closeModal}>Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
