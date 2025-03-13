const express = require('express');
const {  updateLocation, updateProfile, updatePassion, updateLanguages} = require('../controllers/profileController');
const router = express.Router();

router.patch('/profile/:userId/profileInfo', updateProfile);
router.patch('/profile/:userId/location', updateLocation);
router.patch('/profile/:userId/passion', updatePassion);
router.patch('/profile/:userId/languages', updateLanguages);


module.exports = router;
