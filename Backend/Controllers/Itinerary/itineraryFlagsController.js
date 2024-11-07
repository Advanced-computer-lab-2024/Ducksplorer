const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const toggleActiveFlagItinerary = async (req, res) => {
    try {
        const { id } = req.params;

     
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid ID" });
        }

        const itinerary = await itineraryModel.findById(id);

        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }

        // Toggle the flag status
        itinerary.isActive = !itinerary.isActive; // Set flag to the opposite of its current value

        // Save the updated itinerary because it is not just changed in memory not on server
        const updatedItinerary = await itinerary.save();

        res.status(200).json({
            itinerary: updatedItinerary,
            message: `Itinerary flagged as ${updatedItinerary.flag ? "activated" : "deactivated"}`,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { toggleActiveFlagItinerary }
