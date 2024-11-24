const mongoose = require('mongoose');
const Itinerary = require("../../Models/itineraryModel");
const TourGuide = require('../../Models/tourGuideModel');

const viewMyItineraries = async (req, res) => {
    const { tourGuideName } = req.params;
    try {

        const tourGuide = await TourGuide.findOne({ userName: tourGuideName });

        const tourGuideId = tourGuide._id;

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

const filterMyItineraries = async (req, res) => {
    const { date, month, year } = req.query;
    const filters = {};
    const dateFilters = [];

    if (date) {
        const dateObject = new Date(date); // Input date
        const startOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 23, 59, 59, 999));
        // Add to query
        dateFilters.push({
            availableDatesAndTimes: {
                $elemMatch: { $gte: startOfDay, $lte: endOfDay },
            },
        });
    }


    // Month and year filter (for availableDatesAndTimes)
    else if (month && year) {
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10) - 1; // Adjust for zero-indexed months
        const startOfMonth = new Date(yearNum, monthNum, 1);  // Start of the month
        const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);  // End of the month
        // Use $elemMatch to check if any date in the array matches the month range
        dateFilters.push({
            availableDatesAndTimes: {
                $elemMatch: { $gte: startOfMonth, $lte: endOfMonth },
            },
        });
    }

    // Month-only filter (current year)
    else if (month) {
        const monthNum = parseInt(month, 10) - 1; // Adjust for zero-indexed months
        const startOfMonth = new Date(new Date().getFullYear(), monthNum, 1);  // Start of this month
        const endOfMonth = new Date(new Date().getFullYear(), monthNum + 1, 0, 23, 59, 59, 999);  // End of this month
        // Use $elemMatch to check if any date in the array matches the month range
        dateFilters.push({
            availableDatesAndTimes: {
                $elemMatch: { $gte: startOfMonth, $lte: endOfMonth },
            },
        });
    }

    // Year-only filter (entire year)
    else if (year) {
        const yearNum = parseInt(year, 10);
        const startOfYear = new Date(yearNum, 0, 1);  // Start of the year
        const endOfYear = new Date(yearNum + 1, 0, 1); // Start of next year
        // Use $elemMatch to check if any date in the array matches the year range
        dateFilters.push({
            availableDatesAndTimes: {
                $elemMatch: { $gte: startOfYear, $lt: endOfYear },
            },
        });
    }

    // Apply the date filters
    if (dateFilters.length > 0) {
        filters.$and = dateFilters;
    }

    try {
        // Fetch itineraries based on filters
        const itineraries = await Itinerary.find(filters);

        // Return the filtered itineraries
        res.status(200).json(itineraries);
    } catch (error) {
        console.error("Error fetching itineraries:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




module.exports = { viewMyItineraries, filterMyItineraries };