const Tourist = require('../Models/touristModel.js');
const User = require('../Models/userModel.js');

const getTouristDetails = async (req, res) => {
  const { userName } = req.params;
  try {
    const tourist = await Tourist.findOne({ userName });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    return res.status(200).json(tourist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTouristDetails = async (req, res) => {
  const userName = req.body.userName;
  const newPassword = req.body.password;
  const updateData = { ...req.body };

  try {
    // Update the Tourist details first
    const tourist = await Tourist.findOneAndUpdate({ userName }, updateData, { new: true });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    if (newPassword) {
      const user = await User.findOneAndUpdate({ userName }, { password: newPassword }, // Update with plain text password{ new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found for update' });
      }
    }

    return res.status(200).json({ tourist }); // Return only Tourist for now
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTouristDetails,
  updateTouristDetails
};