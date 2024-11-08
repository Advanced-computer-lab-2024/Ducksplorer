const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const rateItinerary = async (req, res) => {
    const { itineraryId } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
            message: "Invalid rating. Please provide a rating between 1 and 5.",
        });
    }

    try {
        const itinerary = await itineraryModel.findById(itineraryId);

        if (!itinerary) {
            return res.status(404).json({ message: "Itinerary not found" });
        }
        itinerary.ratings.push(rating);
        const sum = itinerary.ratings.reduce((acc, val) => acc + val, 0);
        itinerary.averageRating = sum / itinerary.ratings.length;
        await itinerary.save();

        res.status(200).json({ message: "Rating added successfully", itinerary });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





module.exports = { rateItinerary }
//make sure this is correct