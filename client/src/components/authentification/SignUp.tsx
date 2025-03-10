import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../../config/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { handleFirebaseError } from "../../utils/firebaseErrorHandler";
import axios from "axios";
const API_BASE_URL = "http://localhost:5000/api/auth";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [waitingForVerification, setWaitingForVerification] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

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
      const newUser = userCredential.user;
      await sendEmailVerification(newUser);
      setShowModal(true);
     
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

  const handleSocialSignUp = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const socialUser = result.user;

      // Send user data to backend immediately
      const token = await socialUser.getIdToken();
      const userData = {
        uid: socialUser.uid,
        email: socialUser.email,
        name: socialUser.displayName || "",
        picture: socialUser.photoURL || "",
      };

      await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/profile");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/signin", {
      state: {
        emailSent: true,
        email: email,
      },
    });
  };

  return (
    <div className="App">
      <div className="card">
        <h2>Create Your Account</h2>
        <p className="text-xl">Join us and start your journey!</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSignUp} className="my-3">
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
          <button type="submit" disabled={loading} className="button">
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <h3>Or sign up with:</h3>
        <div className="social-buttons">
          <button
            onClick={() => handleSocialSignUp(googleProvider)}
            className="google-button my-2"
          >
            <img src="/google-icon.png" alt="google icon" className="w-6 h-6" />
            Sign Up with Google
          </button>
          <button
            onClick={() => handleSocialSignUp(facebookProvider)}
            className="facebook-button"
          >
            <img
              src="/facebook-icon.png"
              alt="facebook icon"
              className="w-6 h-6"
            />
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Almost there!</h2>
            <p>
              We've sent a verification email to <b>{email}</b>. Please check
              your inbox and click the link to activate your account.
            </p>
            <p>Once verified, your account will be activated automatically.</p>
            <button className="modal button" onClick={closeModal}>
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
