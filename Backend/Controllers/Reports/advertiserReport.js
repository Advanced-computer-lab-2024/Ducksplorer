const mongoose = require('mongoose');
const ActivityBooking = require('../../Models/activityBookingModel');
const Activity = require('../../Models/activityModel')

const viewMyActivities = async (req, res) => {
    const { advertiserName } = req.params;

    try {
        // Fetch all activity bookings for the advertiser
        const activityBookings = await ActivityBooking.find().populate('activity');

        if (!activityBookings || activityBookings.length === 0) {
            return res.status(404).json({ error: "No activity bookings found" });
        }

        // Filter bookings by the advertiser name and fetch activities
        const filteredBookings = activityBookings.filter(
            (booking) => booking.activity.advertiser === advertiserName
        );

        if (!filteredBookings || filteredBookings.length === 0) {
            return res.status(404).json({ message: "No activities found for the advertiser" });
        }

        // Format the response to include activities with chosen price
        const activitiesWithPrices = filteredBookings.map((booking) => ({
            activity: booking.activity,
            chosenPrice: booking.chosenPrice,
            chosenDate: booking.chosenDate
        }));
        res.status(200).json(activitiesWithPrices);
    } catch (err) {
        console.error("Error fetching activities:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};


const filterMyActivities = async (req, res) => {
    const { advertiserName } = req.params;
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

    try {
        // Find all Activities for the given advertiser
        const activities = await Activity.find({ advertiser: advertiserName });

        if (!activities || activities.length === 0) {
            return res.status(404).json({ message: "No activities found for the advertiser" });
        }

        // Extract the activityIds from the activities
        const activityIds = activities.map(activity => activity._id);

        // Now filter ActivityBookings based on the found activityIds
        const activityBookings = await ActivityBooking.find({
            activity: { $in: activityIds },
            ...filters
        }).populate('activity'); // Populate the activity field to include the full activity details

        // Check if no bookings were found, and return an empty string
        if (!activityBookings || activityBookings.length === 0) {
            return res.status(200).json("");  // Returning an empty string
        }

        // Format the response to include activities with chosen price and chosen date
        const activitiesWithPrices = activityBookings.map((booking) => ({
            activity: booking.activity,
            chosenPrice: booking.chosenPrice,
            chosenDate: booking.chosenDate
        }));

        res.status(200).json(activitiesWithPrices);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { viewMyActivities, filterMyActivities };
