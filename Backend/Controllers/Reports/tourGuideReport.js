const mongoose = require('mongoose');
const ItineraryBooking = require('../../Models/itineraryBookingModel');
const Itinerary = require('../../Models/itineraryModel');
const TourGuide = require('../../Models/tourGuideModel'); // Import the TourGuide model

const viewMyItineraries = async (req, res) => {
    const { tourGuideName } = req.params;

    try {
        // Find the tour guide by name to get the ID
        const tourGuide = await TourGuide.findOne({ userName: tourGuideName });
        if (!tourGuide) {
            return res.status(404).json({ error: "Tour guide not found" });
        }

        // Fetch all itinerary bookings and populate the itinerary
        const itineraryBookings = await ItineraryBooking.find()
            .populate('itinerary');

        if (!itineraryBookings || itineraryBookings.length === 0) {
            return res.status(404).json({ error: "No itinerary bookings found" });
        }

        // Filter bookings by the tour guide's ID
        const filteredBookings = itineraryBookings.filter(
            (booking) => booking.itinerary?.tourGuideModel?.toString() === tourGuide._id.toString()
        );

        if (!filteredBookings || filteredBookings.length === 0) {
            return res.status(404).json({ message: "No itineraries found for the tour guide" });
        }

        // Format the response to include itineraries with chosen price and date
        const itinerariesWithPrices = filteredBookings.map((booking) => ({
            itinerary: booking.itinerary,
            chosenPrice: booking.chosenPrice,
            chosenDate: booking.chosenDate,
        }));

        res.status(200).json(itinerariesWithPrices);
    } catch (err) {
        console.error("Error fetching itineraries:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


const filterMyItineraries = async (req, res) => {
    const { tourGuideName } = req.params;
    const { date, month, year } = req.query;
    const dateFilters = [];

    // Exact date filter
    if (date) {
        const dateObject = new Date(date); // Input date
        const startOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 23, 59, 59, 999));

        dateFilters.push({ "chosenDate": { $gte: startOfDay, $lte: endOfDay } });
    }

    // Month and year filter
    else if (month && year) {
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(yearNum, monthNum, 1);
        const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

        dateFilters.push({ "chosenDate": { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Month-only filter
    else if (month) {
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(new Date().getFullYear(), monthNum, 1);
        const endOfMonth = new Date(new Date().getFullYear(), monthNum + 1, 0, 23, 59, 59, 999); // End of the month

        dateFilters.push({ "chosenDate": { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Year-only filter
    else if (year) {
        const yearNum = parseInt(year, 10);
        const startOfYear = new Date(yearNum, 0, 1);  // Start of the year
        const endOfYear = new Date(yearNum + 1, 0, 1); // Start of next year

        dateFilters.push({ "chosenDate": { $gte: startOfYear, $lt: endOfYear } });
    }

    // Apply date filters
    const filters = {};
    if (dateFilters.length > 0) {
        filters.$and = dateFilters;
    }

    console.log("Filters being applied:", filters); // Log the filter to check

    try {
        // Find the tour guide
        const tourGuide = await TourGuide.findOne({ userName: tourGuideName });
        if (!tourGuide) {
            return res.status(404).json({ message: "Tour guide not found" });
        }
        console.log("Tour Guide ID:", tourGuide._id);

        // Fetch all Itineraries for the given tour guide
        const itineraries = await Itinerary.find({ tourGuideModel: tourGuide._id }); // Ensure you're filtering by _id
        if (!itineraries || itineraries.length === 0) {
            return res.status(404).json({ message: "No itineraries found for the tour guide" });
        }

        // Extract the itinerary IDs
        const itineraryIds = itineraries.map(itinerary => itinerary._id);

        // Now filter ItineraryBookings based on the found itineraryId and date filters
        const itineraryBookings = await ItineraryBooking.find({
            itinerary: { $in: itineraryIds },
            ...filters
        }).populate('itinerary'); // Populate to include full itinerary details

        console.log("Itinerary Bookings after filter:", itineraryBookings); // Log to check

        // Check if no bookings were found, and return an empty string
        if (!itineraryBookings || itineraryBookings.length === 0) {
            return res.status(200).json([]); // Return an empty array
        }

        // Format the response to include activities with chosen price and chosen date
        const itinerariesWithPrices = itineraryBookings.map((booking) => ({
            itinerary: booking.itinerary,
            chosenPrice: booking.chosenPrice,
            chosenDate: booking.chosenDate
        }));

        res.status(200).json(itinerariesWithPrices);
    } catch (error) {
        console.error("Error fetching itineraries:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { viewMyItineraries, filterMyItineraries };