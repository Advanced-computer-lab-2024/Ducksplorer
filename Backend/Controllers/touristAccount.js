const Tourist = require('../Models/touristModel.js');
const User = require('../Models/userModel.js');
const ItineraryBooking = require("../Models/itineraryBookingModel.js");
const ActivityBooking = require("../Models/activityBookingModel.js");


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
    console.log(updateData);

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

  //get all the preferences of a tourist
  const getTouristPreferences = async (req, res) => {
    const {userName} = req.params;
    try {
      const tourist = await Tourist.findOne({userName});
  
      if (!tourist){
      res.status(404).json({ message: 'Tourist not found' });
      }
      else{
       res.status(200).json(tourist.tagPreferences);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  const getFavoriteCategory = async (req, res) => {
    const {userName} = req.params;
    try {
      const tourist = await Tourist.findOne({userName});
  
      if (!tourist){
      res.status(404).json({ message: 'Tourist not found' });
      }
      else{
       res.status(200).json(tourist.favouriteCategory);
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

const deleteMyTouristAccount = async (req, res) => {
  try {
    // Get tourist username from the route parameters
    const { userName } = req.params;

    //Find the tourist by his username which is given as a parameter
    const tourist = await Tourist.findOne({ userName: userName });

    if (!tourist) {
      return res.status(404).json({ error: 'Tourist not found' });
    }

    // Delete the tourist account from the tourist model and users model
    await Tourist.findByIdAndDelete(tourist._id);
    await User.findOneAndDelete({userName:userName});

    // Delete the tourist from the bookings table
    await ItineraryBooking.deleteMany({ user: userName });
    await ActivityBooking.deleteMany({user:userName});

    // Respond with a success message
    res.status(200).json({ message: "Tourist account deleted successfully." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  getTouristDetails,
  updateTouristDetails,
    getTouristPreferences,
    getFavoriteCategory,
  deleteMyTouristAccount
};
