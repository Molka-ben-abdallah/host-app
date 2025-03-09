import { FirebaseError } from "firebase/app";

export const handleFirebaseError = (error: FirebaseError) => {
  switch (error?.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-disabled":
      return "Your account has been disabled. Please contact support.";
    case "auth/user-not-found":
      return "No account found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/email-already-in-use":
      return "This email is already associated with another account.";
    case "auth/weak-password":
      return "Your password is too weak. Please choose a stronger password.";
    case "auth/operation-not-allowed":
      return "This authentication method is not enabled. Please contact support.";
    case "auth/timeout":
      return "The request timed out. Please try again later.";
    case "auth/too-many-requests":
      return "Too many requests. Please try again later.";
    case "auth/invalid-credential":
      return "Invalid credential. Please try again.";
    case "auth/invalid-verification-code":
      return "The verification code is invalid. Please try again.";
    default:
      return "An unknown error occurred. Please try again.";
  }
};
