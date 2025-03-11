const admin = require("firebase-admin");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    // Authorization header check
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token format" });
    }

    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Destructure with fallback values
    const {
      uid = null,
      email = null,
      name = "",
      picture: photoUrl = "",
    } = decodedToken;

    // Validate required fields
    if (!uid || !email) {
      return res.status(400).json({
        message: "Invalid token: Missing required UID or email",
      });
    }

    // Check for existing user using both uid and email
    const existingUser = await User.findOne({
      $or: [{ uid }, { email }],
    });

    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        userId: existingUser._id,
        user: existingUser,
      });
    }

    // Create new user document
    const newUser = new User({
      uid,
      email,
      name,
      photoUrl,
    });

    await newUser.save();

    // Logging with all relevant fields
    console.log("New user registered:", {
      uid,
      email,
      name: name || "Not provided",
      photoUrl: photoUrl || "No photo URL",
    });

    const userResponse = newUser.toObject();

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      userId: userResponse._id,
      user: userResponse, // Send plain object instead of Mongoose document
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle different error types
    const statusCode = error.code === "auth/id-token-expired" ? 401 : 500;
    const errorMessage =
      error.code === "auth/id-token-expired"
        ? "Token expired. Please re-authenticate."
        : "Internal server error";

    return res.status(statusCode).json({
      message: "Registration failed",
      error: errorMessage,
    });
  }
};

const checkUser = async (req, res) => {
  try {
    const { email } = req.params;

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    return res.status(200).json({
      exists: !!user,
      ...(user && { userId: user._id }),
    });
  } catch (error) {
    console.error("Check user error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { registerUser, checkUser };
