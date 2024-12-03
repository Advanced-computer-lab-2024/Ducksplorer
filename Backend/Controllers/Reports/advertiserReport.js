const mongoose = require('mongoose');
const ActivityBooking = require('../../Models/activityBookingModel');
const Activity = require('../../Models/activityModel')
const Advertiser = require('../../Models/advertiserModel');

const viewMyActivities = async (req, res) => {
    const { advertiserName } = req.params;
    try {
        const advertiser = await Advertiser.findOne({ userName: advertiserName });
        if (!advertiser) {
            return res.status(404).json({ error: "Advertiser not found" });
        }

        const activities = await Activity.find({ advertiser: advertiserName });
        if (activities.length === 0) {
            return res.status(404).json({ message: "No activities found" });
        }

        // Mapping over the activities to include the necessary fields (bookedCount, totalGain)
        const activitiesWithStats = activities.map(activity => ({
            activity,
            numOfBookings: activity.bookedCount,
            totalEarnings: activity.totalGain
        }));

        // Send the response with the activities and their associated stats
        res.status(200).json(activitiesWithStats);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
};


const filterMyActivities = async (req, res) => {
    const { advertiserName } = req.params;
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
        // Find all Activities for the given advertiser
        const activities = await Activity.find({
            advertiser: advertiserName,
            // ...filters, // Apply date filters
        });

        if (!activities || activities.length === 0) {
            return res.status(404).json({ message: "No activities found for the advertiser" });
        }

        // Array to store results
        const results = [];

        for (const activity of activities) {
            // Fetch all bookings for the current activity
            const activityBookings = await ActivityBooking.find({
                activity: activity._id,
                ...filters, // Apply date filters to bookings
            });

            // Calculate number of bookings and total earnings
            const numOfBookings = activityBookings.length;
            const totalEarnings = activityBookings.reduce((sum, booking) => sum + booking.chosenPrice, 0);

            // Add result to the array
            results.push({
                activity,
                numOfBookings,
                totalEarnings,
            });
        }

        // Send the response
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};





module.exports = { viewMyActivities, filterMyActivities };
