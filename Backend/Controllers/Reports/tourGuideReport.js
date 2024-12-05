const mongoose = require("mongoose");
const ItineraryBooking = require("../../Models/itineraryBookingModel");
const Itinerary = require("../../Models/itineraryModel");
const TourGuide = require("../../Models/tourGuideModel"); // Import the TourGuide model

const viewMyItineraries = async (req, res) => {
  const { tourGuideName } = req.params;
  try {
    const tourGuide = await TourGuide.findOne({ userName: tourGuideName });
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    const tourGuideId = tourGuide._id;

    // Fetch all itineraries of this tour guide
    const itineraries = await Itinerary.find({ tourGuideModel: tourGuideId });
    if (!itineraries || itineraries.length === 0) {
      return res.status(404).json({ error: "No itineraries found" });
    }

    // Mapping over the itineraries to include the necessary fields (bookedCount, totalGain)
    const itinerariesWithStats = itineraries.map((itinerary) => ({
      itinerary,
      numOfBookings: itinerary.bookedCount,
      totalEarnings: itinerary.totalGain,
    }));

    // Send the response with the itinerariesWithStats and their associated stats
    res.status(200).json(itinerariesWithStats);
  } catch (err) {
    console.error("Error fetching itineraries:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const filterMyItineraries = async (req, res) => {
  const { tourGuideName } = req.params;
  const { date, month, year } = req.query;

  // Prepare the date filters
  const dateFilters = [];

  // Exact date filter
  if (date) {
    const dateObject = new Date(date); // Input date
    const startOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 23, 59, 59, 999));

    dateFilters.push({ chosenDate: { $gte: startOfDay, $lte: endOfDay } });
}

  // Year and Month filter
  if (month || year) {
    const yearNum = year ? parseInt(year, 10) : new Date().getUTCFullYear(); // Default to current year if not provided
    const monthNum = month ? parseInt(month, 10) - 1 : 0; // Default to January if month is not provided

    const startOfMonth = new Date(Date.UTC(yearNum, monthNum, 1)); // Start of the month
    const endOfMonth = new Date(Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59, 999)); // End of the month

    dateFilters.push({ chosenDate: { $gte: startOfMonth, $lte: endOfMonth } });
}

  // Apply date filters
  const filters = {};
  if (dateFilters.length > 0) {
    filters.$and = dateFilters;
  }

  try {
    const tourGuide = await TourGuide.findOne({ userName: tourGuideName });
    if (!tourGuide) {
      return res.status(404).json({ error: "Tour guide not found" });
    }
    const tourGuideId = tourGuide._id;

    // Find all Itineraries for the given tour guide 
    const itineraries = await Itinerary.find({
      tourGuideModel: tourGuideId,
      // ...filters, // Apply date filters
    });

    if (!itineraries || itineraries.length === 0) {
      return res
        .status(404)
        .json({ message: "No itineraries found for the tour guide " });
    }

    // Array to store results
    const results = [];

    for (const itinerary of itineraries) {
      // Fetch all bookings for the current itinerary
      const itineraryBookings = await ItineraryBooking.find({
        itinerary: itinerary._id,
        ...filters, // Apply date filters to bookings
      });

      // Calculate number of bookings and total earnings
      const numOfBookings = itineraryBookings.length;
      const totalEarnings = itineraryBookings.reduce(
        (sum, booking) => sum + booking.chosenPrice,
        0
      );

      // Add result to the array
      results.push({
        itinerary,
        numOfBookings,
        totalEarnings,
      });
    }

    // Send the response
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching itineraries:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = { viewMyItineraries, filterMyItineraries };
