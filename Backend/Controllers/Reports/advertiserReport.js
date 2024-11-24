const mongoose = require('mongoose');
const Activity = require('../../Models/activityModel');
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

        res.status(200).json(activities);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
};

const filterMyActivities = async (req, res) => {
    const { date, month, year } = req.query;
    const filters = {};
    const dateFilters = [];

    // Exact date filter
    if (date) {
        const dateObject = new Date(date); // Input date
        const startOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 0, 0, 0));
        const endOfDay = new Date(Date.UTC(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate(), 23, 59, 59, 999));

        // Add the date filter
        dateFilters.push({ date: { $gte: startOfDay, $lte: endOfDay } });
    }


    // Month and year filter
    else if (month && year) {
        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(yearNum, monthNum, 1);
        const endOfMonth = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999);

        dateFilters.push({ date: { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Month-only filter
    else if (month) {
        const monthNum = parseInt(month, 10) - 1;
        const startOfMonth = new Date(new Date().getFullYear(), monthNum, 1);
        const endOfMonth = new Date(new Date().getFullYear(), monthNum + 1, 0, 23, 59, 59, 999); // End of the month

        dateFilters.push({ date: { $gte: startOfMonth, $lte: endOfMonth } });
    }

    // Year-only filter
    else if (year) {
        const yearNum = parseInt(year, 10);
        const startOfYear = new Date(yearNum, 0, 1);  // Start of the year
        const endOfYear = new Date(yearNum + 1, 0, 1); // Start of next year

        dateFilters.push({ date: { $gte: startOfYear, $lt: endOfYear } });
    }

    if (dateFilters.length > 0) {
        filters.$and = dateFilters;
    }

    try {
        const activities = await Activity.find(filters);
        // if (activities.length === 0) {
        //     return res.status(404).json({ message: "No activities found" });
        // }
        res.status(200).json(activities);
    } catch (error) {
        console.error("Error fetching activities:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = { viewMyActivities, filterMyActivities };
