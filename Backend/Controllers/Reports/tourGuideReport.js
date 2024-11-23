const mongoose = require('mongoose');
const Itinerary = require("../../Models/itineraryModel");
const TourGuide = require('../../Models/tourGuideModel');

const viewMyItineraries = async (req, res) => {
    const { tourGuideName } = req.params;
    try {

        const tourGuideId = await TourGuide.findOne({ userName: tourGuideName });

        if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
            return res.status(400).json({ error: "ID invalid" });
        }

        const itineraries = await Itinerary.find({ tourGuideModel: tourGuideId });

        if (!itineraries) {
            return res.status(404).json({ message: "No itineraries found" });
        }
        res.status(200).json(itineraries);
        console.log(itineraries);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { viewMyItineraries };