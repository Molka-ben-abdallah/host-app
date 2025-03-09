const admin = require("firebase-admin");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);

    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name;
    const picture = decodedToken.picture;

    if (!uid || !email) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ message: "User already exists", user });
    }

    user = new User({
      uid,
      email,
      name,
      picture,
    });

    await user.save();
    console.log("User registered and saved to DB:", { uid, email });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const checkUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, checkUser };
