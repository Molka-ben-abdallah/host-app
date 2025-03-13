const express = require("express");
const multer = require("multer");
const imagekit = require("../utils/imageKit");
const User = require("../models/User");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload/:userId", upload.single("image"), async (req, res) => {
  try {
    const { userId } = req.params;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Upload image to ImageKit
    const uploadedImage = await imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder: "profile_pictures",
    });

    // Update user's profileImage field in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photoUrl: uploadedImage.url },
      { new: true }
    );

    res.json({ message: "Image uploaded successfully", imageUrl: updatedUser.photoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
