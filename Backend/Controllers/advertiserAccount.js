const Advertiser = require('../Models/advertiserModel.js');
const User = require('../Models/userModel.js');

const getAdvertiserDetails = async (req, res) => {
  const { userName } = req.params;
  try {
    const advertiser = await Advertiser.findOne({ userName });

    if (!advertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }

    return res.status(200).json(advertiser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateAdvertiserDetails = async (req, res) => {
  const userName = req.body.userName;
  const newPassword = req.body.password;
  const updateData = { ...req.body };

  try {
    // Update the advertiser details first
    const advertiser = await Advertiser.findOneAndUpdate({ userName }, updateData, { new: true });

    if (!advertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }

    if (newPassword) {
      const user = await User.findOneAndUpdate({ userName }, { password: newPassword }, // Update with plain text password{ new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found for update' });
      }
    }

    return res.status(200).json({ advertiser }); // Return only advertiser for now
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const removeFileUrl = async (req, res) => {
  const { userName, uploads } = req.body;

  if (!userName || !uploads) {
    return res.status(400).json({ error: 'userName and uploads are required' });
  }

  try {
    // Find the tour guide by username
    const advertiser = await Advertiser.findOne({ userName });
    if (!advertiser) {
      return res.status(404).json({ error: 'advertiser not found' });
    }

    advertiser.uploads = ''; // Clear the uploads field
    // Save the updated document
    await advertiser.save();
    res.status(200).json({ message: 'File URL removed successfully' });
  } catch (error) {
    console.error('Error deleting file URL:', error);
    res.status(500).json({ error: 'An error occurred while deleting the file URL' });
  }
};

module.exports = {
  getAdvertiserDetails,
  updateAdvertiserDetails,
  removeFileUrl
};