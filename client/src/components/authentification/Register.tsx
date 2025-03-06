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
import "../App.css"; // Importing styles

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(""); // New state for the verification message
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
    setSuccessMessage("");
    setVerificationMessage(""); // Reset verification message
    setLoading(true); // Set loading to true to disable submit button during registration

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send verification email
      await sendEmailVerification(userCredential.user);

      // Show success message
      setSuccessMessage(
        "Registration successful! A verification email has been sent to your inbox."
      );

      // Show message to check the email
      setVerificationMessage(
        "Please check your email for the verification link."
      );

      // Optionally, redirect the user after registration (This is delayed since we want to keep the user on the page)
      // navigate("/login"); // Remove or comment out this line to stay on the page
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); // Set the error message if registration fails
      }
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Check if the email is verified before allowing access to profile
  const checkEmailVerification = () => {
    const user = auth.currentUser;
    if (user && user.emailVerified) {
      navigate("/profile"); // Redirect to profile if email is verified
    } else {
      setError("Please verify your email first.");
    }
  };

  // Add effect to check if user has already verified their email (if the page reloads)
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate("/profile");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="App">
      <div className="card">
        <h2>Register</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        {verificationMessage && (
          <p className="verification-message">{verificationMessage}</p>
        )}

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
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

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

        <p>
          <a href="/login" className="link-style">
            Already have an account?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
