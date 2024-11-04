const Tourist = require('../Models/touristModel.js');
const Bookings = require("../Models/bookingsModel.js");


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
  const updateData = req.body;

  try {
    const tourist = await Tourist.findOneAndUpdate({ userName }, updateData, { new: true });

    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }

    return res.status(200).json(tourist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//Used for when a tourist decides to delete his account 
const deleteTourist = async (req, res) => {
  try {
    const { userName } = req.params;

    const deletedTourist = await Tourist.findByIdAndDelete(userName);
    if (!deletedTourist) {
      return res.status(404).json({ message: "Tourist not found" });
    }
    res.status(200).json(deletedTourist)
  }
  catch (error) {
    res.status(400).json({ message: "Error deleting Tourist " })
  }
}

const deleteMyTouristAccount = async (req, res) => {
  try {
    // Get tourist username from the route parameters
    const { userName } = req.params;

    //Find the tourist by his username which is given as a parameter
    const tourist = await Tourist.findOne({ userName: userName });

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Delete the tourist account from the tourist model
    await Tourist.findByIdAndDelete(Tourist._id);

    // Delete the tourist from the bookings table
    await Bookings.deleteMany({ user: userName });

    // Respond with a success message
    res.status(200).json({ message: "Tourist account deleted successfully." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  getTouristDetails,
  updateTouristDetails,
  deleteMyTouristAccount
};
