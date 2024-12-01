const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');


const deleteOnlyNotBookedItinerary = async (req, res) => {
   
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID invalid" });
        }
        const itinerary = await itineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }
       
        if (itinerary.bookedCount >= 1) {
            return res.status(400).json({ error: "Cannot delete a booked itinerary" });
        }

        // If bookedCount is less than 1, proceed to delete
        await itineraryModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Itinerary deleted" });

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
   
}
module.exports = { deleteOnlyNotBookedItinerary};


