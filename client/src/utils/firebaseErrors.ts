const getFriendlyErrorMessage = (errorCode: string) => {
  const errorMessages: { [key: string]: string } = {
    "auth/email-already-in-use":
      "This email is already in use. Try logging in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Your password is too weak. Try a stronger one.",
    "auth/missing-password": "Please enter a password.",
    "auth/user-disabled":
      "This account has been disabled. Contact support for help.",
    "auth/operation-not-allowed":
      "Sign up is currently disabled. Try again later.",
    "auth/internal-error": "An unexpected error occurred. Please try again.",
    "auth/network-request-failed":
      "Network error. Check your internet connection.",
    "auth/popup-closed-by-user":
      "The sign-in popup was closed. Please try again.",
    "auth/cancelled-popup-request": "A previous sign-in popup was canceled.",
    "auth/too-many-requests":
      "Too many attempts. Please wait and try again later.",
    "Email-not-verified": "Please verify your email before signing in.",
  };

  return errorMessages[errorCode] || "Something went wrong. Please try again.";
};

export default getFriendlyErrorMessage;
