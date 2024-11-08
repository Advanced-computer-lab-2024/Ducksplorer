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


// Controller to remove the URL from the schema
const removeFileUrl = async (req, res) => {
  const { userName, fileType } = req.body; // Expecting the userName and fileType ('nationalId' or 'certificates')

  if (!userName || !fileType) {
    return res.status(400).json({ message: 'User Name and File Type are required' });
  }

  try {
    // Determine which field to update
    const updateField = fileType === 'nationalId' ? 'nationalId' : 'certificates';

    // Find the TourGuide document by userName and update the specific field to null or ''
    const updatedTourGuide = await TourGuide.findOneAndUpdate(
      { userName: userName },
      { $set: { [updateField]: '' } }, // Remove the file URL
      { new: true } // Return the updated document
    );

    if (!updatedTourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    res.status(200).json({
      message: `${fileType} URL removed successfully`,
      updatedTourGuide
    });
  } catch (error) {
    console.error('Error removing file URL:', error);
    res.status(500).json({ message: 'Error removing file URL' });
  }
};


module.exports = {
  getTourGuideDetails,
  updateTourGuideDetails,
  removeFileUrl
};