const express = require('express');
const admin = require('../firebase');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
  try {
    const idToken = req.body.idToken; // Firebase ID Token from frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUID = decodedToken.uid;

    // Check if the user already exists in the database
    let user = await User.findOne({ firebaseUID });

    if (!user) {
      // Create a new user if not found
      user = new User({
        firebaseUID,
        email: decodedToken.email,
        displayName: req.body.displayName,
        profilePicture: req.body.profilePicture,
      });

      await user.save();
    }

    // Respond with the user's info
    res.status(200).json({
      message: 'User registered successfully',
      user: {
        email: user.email,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'User registration failed' });
  }
});

// Route to log in and send JWT token for persistent sessions
router.post('/login', async (req, res) => {
  try {
    const idToken = req.body.idToken; // Firebase ID Token from frontend
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUID = decodedToken.uid;

    let user = await User.findOne({ firebaseUID });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Create a JWT for persistent sessions
    const jwtToken = jwt.sign({ firebaseUID: user.firebaseUID }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
      },
      token: jwtToken, // Send JWT for authentication
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Login failed' });
  }
});

// Protected route: Only accessible if token is valid
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUID: req.user.uid });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

module.exports = router;
