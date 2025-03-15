const admin = require("firebase-admin");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Initialize Firebase Admin using the environment variables
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix the newlines in the private key
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});

module.exports = admin;
