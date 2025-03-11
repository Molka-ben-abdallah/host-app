const User = require('../models/User');

const createProfile = async (req, res) => {
    try {
        const newProfile = new User(req.body);
        await newProfile.save();
        res.status(201).json({ message: 'Profile created successfully!', profile: newProfile });
    } catch (error) {
        res.status(500).json({ message: 'Error creating profile', error });
    }
};

const updateLocation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { country, city, localYears, address } = req.body;

        console.log('Received Data:', { userId, country, city, localYears, address });

        // Find the user by ID and update their location
        const user = await User.findByIdAndUpdate(
            userId,
            { location: { country, city, localYears, address } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated User:', user);
        res.status(200).json(user); // Respond with the updated user
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Error updating location', error });
    }
};

  module.exports = { createProfile, updateLocation };