const TourGuide = require('../Models/tourGuideModel.js');
const itineraryModel = require("../Models/itineraryModel");

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
  const updateData = req.body;

  try {
    const tourGuide = await TourGuide.findOneAndUpdate({ userName }, updateData, { new: true });

    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour Guide not found' });
    }

    return res.status(200).json(tourGuide);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteMyTourGuideAccount = async (req, res) => {
  try {
    // Get tour guide username from the route parameters
    const { userName } = req.params;

    //Find the tour guide by his username which is given as a parameter
    const tourGuide = await TourGuide.findOne({ userName: userName });

    if (!tourGuide) {
      return res.status(404).json({ error: 'Tour Guide not found' });
    }

    // Find itineraries associated with the logged in tour guide
    const itineraries = await itineraryModel.find({ tourGuideModel: tourGuide._id });

    if (itineraries.length) {

      // Iterate over each itinerary
      const deletePromises = itineraries.map(async (itinerary) => {
        if (itinerary.bookedCount < 1) {
          await itineraryModel.findByIdAndDelete(itinerary._id);
          return { id: itinerary._id, message: "Itinerary deleted" };
        } else {
          return { id: itinerary._id, message: "Cannot delete booked itinerary" };
        }
      });

      // Results is an array that contains for each itinerary the message Itinerary deleted or the message Cannot delete booked itinerary
      const results = await Promise.all(deletePromises);
      res.status(200).json({ results });

    }
    // Now delete the tour guide account
    await TourGuide.findByIdAndDelete(tourGuide._id);

    // Respond with a success message
    res.status(200).json({ message: "Tour Guide account deleted successfully." });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  getTourGuideDetails,
  updateTourGuideDetails,
  deleteMyTourGuideAccount,
};
