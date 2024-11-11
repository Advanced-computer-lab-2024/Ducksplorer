const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

//This method changes the status of the  itinerary from active to inactive and vice versa
const toggleItineraryActiveStatus= async (req, res) => { 
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
        itinerary.isDeactivated = !itinerary.isDeactivated; // Set flag to the opposite of its current value

        // Save the updated itinerary because it is not just changed in memory not on server
        const updatedItinerary = await itinerary.save();

        res.status(200).json({
            itinerary: updatedItinerary,
            message: `Itinerary flagged as ${updatedItinerary.isDeactivated ? "Deactivated" : "Activated"}`,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { toggleItineraryActiveStatus }