const TourGuide = require('../Models/tourGuideModel.js');
const User = require('../Models/userModel.js');

const getTourGuideDetails = async (req, res) => {
  const { userName } = req.params;
  try {
    const tourGuide = await TourGuide.findOne({ userName });

    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour Guide not found' });
    }

    return res.status(200).json(tourGuide);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateTourGuideDetails = async (req, res) => {
  const userName = req.body.userName;
  const newPassword = req.body.password;
  const updateData = { ...req.body };

  try {
    // Update the TourGuide details first
    const tourGuide = await TourGuide.findOneAndUpdate({ userName }, updateData, { new: true });

    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour Guide not found' });
    }

    if (newPassword) {
      const user = await User.findOneAndUpdate({ userName }, { password: newPassword }, // Update with plain text password{ new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found for update' });
      }
    }

    return res.status(200).json({ tourGuide }); // Return only TourGuide for now
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getTourGuideDetails,
  updateTourGuideDetails
};