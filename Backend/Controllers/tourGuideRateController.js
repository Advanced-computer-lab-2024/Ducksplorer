const ItineraryBooking = require('../Models/itineraryBookingModel.js');
const Itinerary = require('../Models/itineraryModel.js');
const TourGuide = require('../Models/tourGuideModel.js');
const UserModels = require('../Models/userModel.js');
const mongoose = require('mongoose');

const rateTourGuide = async (req, res) => {
    const { tourGuideId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Invalid rating. Please provide a rating between 1 and 5.",
        });
    }

    try {
        const tourGuide = await TourGuide.findById(tourGuideId);

        if (!tourGuide) {
            return res.status(404).json({ message: "Tour Guide not found" });
        }
        tourGuide.ratings.push(rating);
        const sum = tourGuide.ratings.reduce((acc, val) => acc + val, 0);
        tourGuide.averageRating = sum / tourGuide.ratings.length;
        await tourGuide.save();

        res.status(200).json({ message: "Rating added successfully", tourGuide });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const getUserNameById = async (req, res) => {
    const { bookingId } = req.params;

    // Validate bookingId
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(200).json({ userName: "N/A" });
    }

    try {
        // Find booking by ID
        const booking = await ItineraryBooking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking doesn't exist" });
        }

        // Find itinerary by the itinerary ID in booking
        const itinerary = await Itinerary.findById(booking.itinerary._id);
        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary doesn't exist" });
        }

        // Find tour guide by ID
        const tourGuide = await TourGuide.findById(itinerary.tourGuideModel);
        if (!tourGuide) {
            return res.status(404).json({ message: "Tour Guide doesn't exist" });
        }

        // Respond with the tour guide's user name
        res.status(200).json({ userName: tourGuide.userName });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//check if tourGuide is found using his id
const getTourGuideById = async (req, res) => {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(200).json({ present: false, message: "Invalid ID format" });
    }
    else {
        const { id } = req.params;
        const tourGuide = await TourGuide.findById(id);
        if (!tourGuide) {
            res.status(200).json({ present: false });
        }
        else {
            res.status(200).json({ present: true });
        }
    }
}
module.exports = {
    rateTourGuide, getUserNameById, getTourGuideById
};
