const Advertiser = require('../Models/advertiserModel.js');
const Activity = require("../Models/activityModel.js");

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
  const updateData = req.body;

  try {
    const advertiser = await Advertiser.findOneAndUpdate({ userName }, updateData, { new: true });

    if (!advertiser) {
      return res.status(404).json({ message: 'Advertiser not found' });
    }

    return res.status(200).json(advertiser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteMyAdvertiserAccount = async (req, res) => {
  try {
    // Get advertiser username from the route parameters
    const { userName } = req.params;

    //Find the advertiser by his username which is given as a parameter
    const advertiser = await Advertiser.findOne({ userName: userName });

    if (!advertiser) {
      return res.status(404).json({ error: 'Advertiser not found' });
    }
    // Find activities associated with the logged in advertiser
    const activities = await Activity.find({ advertiser: userName });

    if (activities.length) {

      // Iterate over each activity
      const deletePromises = activities.map(async (activity) => {
        if (activity.bookedCount < 1) {
          await Activity.findByIdAndDelete(activity._id);
          return { id: activity._id, message: "Activity deleted" };
        } else {
          return { id: activity._id, message: "Cannot delete booked activity" };
        }
      });

      // Results is an array that contains for each activity the message activity deleted or the message cannot delete booked activity
      const results = await Promise.all(deletePromises);
      res.status(200).json({ results });
    }
    // Now delete the advertiser account
    await Advertiser.findByIdAndDelete(advertiser._id);

    // Respond with a success message
    res.status(200).json({ message: "Advertiser account deleted successfully." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getAdvertiserDetails,
  updateAdvertiserDetails,
  deleteMyAdvertiserAccount
};
