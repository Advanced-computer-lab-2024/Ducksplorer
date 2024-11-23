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

module.exports = { viewMyActivities };
