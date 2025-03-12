const User = require('../models/User');

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const { firstName,
            lastName,
            birthday,
            nationality,
            email,
            mobile } = req.body;

        console.log('Received Data:', { userId, firstName,
            lastName,
            birthday,
            nationality,
            email,
            mobile});
        const user = await User.findByIdAndUpdate(
            userId,
            { firstName,
                lastName,
                birthday,
                nationality,
                email,
                mobile },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated User:', user);
        res.status(200).json(user); 
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Error updating location', error });
    }
};

const updateLocation = async (req, res) => {
    try {
        const { userId } = req.params;
        const { country, city, localYears, address } = req.body;

        console.log('Received Data:', { userId, country, city, localYears, address });

        const user = await User.findByIdAndUpdate(
            userId,
            { location: { country, city, localYears, address } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated User:', user);
        res.status(200).json(user); 
    } catch (error) {
        console.error('Error updating location:', error);
        res.status(500).json({ message: 'Error updating location', error });
    }
};
const updatePassion = async (req, res) => {
    try {
        const { userId } = req.params;
        const {passions, description, cityFavorite } = req.body;

        console.log('Received Data:', { userId, passions, description, cityFavorite });


        const user = await User.findByIdAndUpdate(
            userId,
            {  $set: {
                passions, 
                description, 
                'location.cityTrait': cityFavorite, 
            }, },
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

  module.exports = { updateProfile, updateLocation, updatePassion };