const User = require("../models/User");

const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, birthday, nationality, email, mobile } =
      req.body;

    console.log("Received Data:", {
      userId,
      firstName,
      lastName,
      birthday,
      nationality,
      email,
      mobile,
    });

    // Find the user by ID and update their location
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, birthday, nationality, email, mobile },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated User:", user);
    res.status(200).json(user); // Respond with the updated user
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Error updating location", error });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { country, city, localYears, address } = req.body;

    console.log("Received Data:", {
      userId,
      country,
      city,
      localYears,
      address,
    });

    // Find the user by ID and update their location
    const user = await User.findByIdAndUpdate(
      userId,
      { location: { country, city, localYears, address } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated User:", user);
    res.status(200).json(user); // Respond with the updated user
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Error updating location", error });
  }
};
const updatePassion = async (req, res) => {
  try {
    const { userId } = req.params;
    const { passions, description, cityTrait } = req.body;

    console.log("Received Data:", {
      userId,
      passions,
      description,
      cityTrait,
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          passions,
          description,
          "location.cityTrait": cityTrait,
        },
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated User:", user);
    res.status(200).json(user); // Respond with the updated user
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ message: "Error updating location", error });
  }
};
const updateLanguages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { languages } = req.body;

    console.log("Received Data:", { languages });

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { languages } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated User:", user);
    res.status(200).json(user); // Respond with the updated user
  } catch (error) {
    console.error("Error updating languages:", error);
    res.status(500).json({ message: "Error updating languages", error });
  }
};
module.exports = {
  updateProfile,
  updateLocation,
  updatePassion,
  updateLanguages,
};
