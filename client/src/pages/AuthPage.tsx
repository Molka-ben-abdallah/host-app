import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../config/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { handleFirebaseError } from "../utils/firebaseErrorHandler";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api/auth";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [modalError, setModalError] = useState("");
  const [modalSuccess, setModalSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const sendUserToBackend = async (user: any) => {
    try {
      const token = await user.getIdToken();
      console.log("token:", token);
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.name || "",
        photoUrl: user.picture || "",
      };

      const response = await axios.post(`${API_BASE_URL}/register`, userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);
      localStorage.setItem("userId", response.data.user?._id);
      console.log("user id", response.data.user?._id);
      navigate("/profile");
    } catch (error) {
      console.error("Error saving user to backend:", error);
      throw error;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
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
        setShowModal(true);
        return;
      }

      await sendUserToBackend(user);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
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

  const handleSocialAuth = async (provider: any) => {
    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await sendUserToBackend(user);
      navigate("/profile");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setModalSuccess("Password reset email sent successfully!");
      setShowResetModal(false);
    } catch (error) {
      if (error instanceof FirebaseError) {
        setModalError(handleFirebaseError(error));
      }
    }
  };

  const handleGoToProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setModalError("");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user found. Please sign up/sign in first.");
      }

      await user.reload();
      const updatedUser = auth.currentUser;

      if (!updatedUser?.emailVerified) {
        setModalError(
          "Please verify your email before proceeding to your profile."
        );
        return;
      }

      await sendUserToBackend(updatedUser);
      navigate("/profile");
    } catch (error) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof FirebaseError) {
        errorMessage = handleFirebaseError(error);
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setModalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setModalError("");
    setModalSuccess("");
    const user = auth.currentUser;

    if (!user) {
      setModalError("No authenticated user found. Please sign in again.");
      return;
    }

    try {
      setLoading(true);
      await user.reload();

      if (user.emailVerified) {
        setModalError("Email is already verified!");
        return;
      }

      await sendEmailVerification(user);
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);

      setModalSuccess(
        "Verification email resent successfully! Please check your inbox."
      );
    } catch (error) {
      console.error("Error resending verification email:", error);
      let errorMessage = "Failed to resend email. Please try again later.";

      if (error instanceof FirebaseError) {
        errorMessage = handleFirebaseError(error);
        if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later.";
        }
      }

      setModalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {isSignUp ? "Create Your Account" : "Welcome Back!"}
        </h2>
        <p className="text-gray-600 mb-6">
          {isSignUp ? "Start Your Hosting Experience" : "Continue Your Journey"}
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>
        )}

        <form
          onSubmit={isSignUp ? handleSignUp : handleSignIn}
          className="space-y-4"
        >
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
            placeholder={isSignUp ? "Create a password" : "Enter your password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />

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
            {!isSignUp && (
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="text-gray-600 hover:text-[#FFBC20] hover:underline"
              >
                Forgot Password?
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFBC20] text-black p-3 rounded-lg hover:bg-[#FFA500] disabled:bg-[#FFD773] transition-colors font-semibold"
          >
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">Or continue with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialAuth(googleProvider)}
            className="w-full flex items-center justify-center gap-2 bg-white border text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src="/google-icon.png" alt="google icon" className="w-6 h-6" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialAuth(facebookProvider)}
            className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white p-3 rounded-lg hover:bg-[#166FE5] transition-colors"
          >
            <img
              src="/facebook-icon.png"
              alt="facebook icon"
              className="w-6 h-6"
            />
            Continue with Facebook
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#FFBC20] hover:underline"
          >
            {isSignUp ? "Log in" : "Sign Up"}
          </button>
        </p>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
              {modalError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg relative">
                  <button
                    onClick={() => setModalError("")}
                    className="absolute top-2 right-2 text-red-700 hover:text-red-900"
                  >
                    ×
                  </button>
                  {modalError}
                </div>
              )}

              {modalSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg relative">
                  <button
                    onClick={() => setModalSuccess("")}
                    className="absolute top-2 right-2 text-green-700 hover:text-green-900"
                  >
                    ×
                  </button>
                  {modalSuccess}
                </div>
              )}

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Check Your Email! 📬
              </h2>
              <p className="text-gray-600 mb-3">
                We've sent a verification email to{" "}
                <span className="font-semibold text-blue-600">{email}</span>.
              </p>
              <p className="text-gray-600 mb-6">
                Please check your inbox and click the link to activate your
                account.
              </p>

              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={loading || cooldown > 0}
                  className="w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading
                    ? "Sending..."
                    : cooldown > 0
                    ? `Resend available in ${cooldown}s`
                    : "Resend Verification Email"}
                </button>
                <button
                  onClick={handleGoToProfile}
                  className="w-full p-3 bg-[#FFBC20] text-black rounded-lg hover:bg-[#FFA500] transition-colors font-semibold"
                >
                  Go to Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add password reset modal */}
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
                className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                onClick={handlePasswordReset}
                className="w-full p-3 bg-[#FFBC20] text-black rounded-lg hover:bg-[#FFA500] transition-colors font-semibold"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
