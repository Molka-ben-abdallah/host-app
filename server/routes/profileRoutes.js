const express = require('express');
const { createProfile , updateLocation} = require('../controllers/profileController');
const router = express.Router();

router.post('/profile', createProfile);
router.patch('/profile/:userId/location', updateLocation);
module.exports = router;
