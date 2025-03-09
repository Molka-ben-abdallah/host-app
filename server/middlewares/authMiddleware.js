// /middlewares/authMiddleware.js

const admin = require("../config/firebaseconfig"); // Import Firebase config

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1]; // Extract token

  try {
    const decodedToken = await admin.auth().verifyIdToken(token); // Verify the token
    req.user = decodedToken; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(403).send("Forbidden: Invalid token");
  }
};

module.exports = { verifyToken };