import "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyAVbLeZGWBa5VmR3Gom6TvAqSWi6CfEsL0",
  authDomain: "host-application-624fb.firebaseapp.com",
  projectId: "host-application-624fb",
  storageBucket: "host-application-624fb.firebasestorage.app",
  messagingSenderId: "197784237429",
  appId: "1:197784237429:web:e53fc9a76d9ed677818f3c",
  measurementId: "G-W4FPWFK8C2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { googleProvider, facebookProvider };