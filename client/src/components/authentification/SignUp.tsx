import React, { useState } from "react";
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
  const navigate = useNavigate();
  const [cooldown, setCooldown] = useState(0);
  const [modalError, setModalError] = useState("");
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

  const handleGoToProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No user found. Please sign up first.");
      }

      await currentUser.reload();
      const updatedUser = auth.currentUser;

      if (!updatedUser?.emailVerified) {
        setError("Please verify your email before proceeding to your profile.");
        return;
      }

      await sendUserToBackend(updatedUser);
      navigate("/profile");
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

      await sendUserToBackend(socialUser);
      navigate("/profile");
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(handleFirebaseError(error));
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleResendEmail = async () => {
    setModalError("");
    const user = auth.currentUser;
    if (!user) {
      alert("No authenticated user found. Please sign in again.");
      return;
    }
    try {
      setLoading(true);
      await user.reload(); // Refresh user data

      if (user.emailVerified) {
        alert("Email is already verified!");
        return;
      }

      await sendEmailVerification(user);
      setCooldown(60); // 60 seconds cooldown
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);

      alert("Verification email resent successfully! Please check your inbox.");
    } catch (error) {
      console.error("Error resending verification email:", error);
      let errorMessage = "Failed to resend email. Please try again later.";

      if (error instanceof FirebaseError) {
        errorMessage = handleFirebaseError(error);
        if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many requests. Please try again later.";
        }
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-600 mb-6">Start Your Hosting Experience</p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
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
            placeholder="Create a strong password"
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
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">Or continue with</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialSignUp(googleProvider)}
            className="w-full flex items-center justify-center gap-2 bg-white border text-gray-700 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <img src="/google-icon.png" alt="google icon" className="w-6 h-6" />
            Sign Up with Google
          </button>
          <button
            onClick={() => handleSocialSignUp(facebookProvider)}
            className="w-full flex items-center justify-center gap-2 bg-[#1877F2] text-white p-3 rounded-lg hover:bg-[#166FE5] transition-colors"
          >
            <img
              src="/facebook-icon.png"
              alt="facebook icon"
              className="w-6 h-6"
            />
            Sign Up with Facebook
          </button>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <a href="/signin" className="text-[#FFBC20] hover:underline">
            Log in
          </a>
        </p>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
              {/* Modal error display */}
              {modalError && (
                <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                  {modalError}
                </p>
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
      </div>
    </div>
  );
};

export default SignUp;
