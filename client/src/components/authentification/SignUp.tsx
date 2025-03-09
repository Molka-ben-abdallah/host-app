import React, { useState, useEffect, useCallback } from "react";
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
import getFriendlyErrorMessage from "../../utils/firebaseErrors";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Sends token and user data to backend
  const sendUserToBackend = useCallback(
    async (user: any) => {
      try {
        const token = await user.getIdToken();
        console.log("Generated token:", token);

        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.name,
          picture: user.picture,
        };

        console.log("User data:", userData);

        const response = await fetch(
          "http://localhost:5000/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send token in Authorization header
            },
            body: JSON.stringify(userData),
          }
        );

        if (!response.ok) {
          throw new Error("User registration failed.");
        }

        const responseData = await response.json();
        console.log("Backend response:", responseData);

        console.log("User successfully saved in database.");
        navigate("/profile");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(getFriendlyErrorMessage((err as any).code));
        } else {
          setError("An unknown error occurred.");
        }
      }
    },
    [navigate]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.emailVerified) {
        console.log(
          "User is logged in and verified, sending data to backend..."
        );
        await sendUserToBackend(user);
      }
    });

    return () => unsubscribe();
  }, [sendUserToBackend]);

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
      const user = userCredential.user;

      await sendUserToBackend(user);
      await sendEmailVerification(user);

      setShowModal(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(getFriendlyErrorMessage((err as any).code));
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Social Media Sign-Up (Google/Facebook)
  const handleSocialSignUp = async (provider: any) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await sendUserToBackend(user);

      console.log("User successfully saved in database.");
      navigate("/profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(getFriendlyErrorMessage((err as any).code));
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/signin");
  };

  return (
    <div className="App">
      <div className="card">
        <h2>Create Your Account</h2>
        <p className="text-2xl">Join us and start your journey!</p>

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
            onClick={() => handleSocialSignUp(googleProvider)}
            className="google-button"
          >
            Sign Up with Google
          </button>
          <button
            onClick={() => handleSocialSignUp(facebookProvider)}
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
