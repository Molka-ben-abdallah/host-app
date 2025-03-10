import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
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
  const [rememberMe, setRememberMe] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const sendUserToBackend = async (user: any) => {
    try {
      const token = await user.getIdToken();
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || "",
        picture: user.photoURL || "",
      };

      await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error saving user to backend:", error);
      throw error;
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

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

      navigate("/profile"); // Redirect to profile if user exists in DB
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
        setShowErrorModal(true);
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

      navigate("/profile");
      await sendUserToBackend(user);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFBC20] text-black p-3 rounded-lg hover:bg-[#FFA500] disabled:bg-[#FFD773] transition-colors font-semibold"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="flex justify-between items-center">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-[#FFBC20] rounded focus:ring-[#FFBC20]"
              />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button
              onClick={() => setShowResetModal(true)}
              className="text-gray-600 hover:text-[#FFBC20] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">Or continue with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialSignIn(googleProvider)}
            className="w-full flex items-center justify-center gap-2 bg-white border text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src="/google-icon.png" alt="google" className="w-6 h-6" />
            Sign In with Google
          </button>
          <button
            onClick={() => handleSocialSignIn(facebookProvider)}
            className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white p-3 rounded-lg hover:bg-[#166FE5] transition-colors"
          >
            <img src="/facebook-icon.png" alt="facebook" className="w-6 h-6" />
            Sign In with Facebook
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <a href="/" className="text-[#FFBC20] hover:underline">
            Sign Up
          </a>
        </p>
      </div>

      {/* Modals */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowErrorModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full p-3 bg-[#FFBC20] text-black rounded-lg hover:bg-[#FFA500] transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Reset Password
            </h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <div className="space-y-3">
              <button
                onClick={handlePasswordReset}
                className="w-full p-3 bg-[#FFBC20] text-black rounded-lg hover:bg-[#FFA500] transition-colors font-semibold"
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {resetSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Success!</h2>
            <p className="text-gray-600 mb-6">
              A password reset email has been sent. Please check your inbox.
            </p>
            <button
              onClick={() => setResetSuccess(false)}
              className="w-full p-3 bg-[#FFBC20] text-black rounded-lg hover:bg-[#FFA500] transition-colors font-semibold"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
