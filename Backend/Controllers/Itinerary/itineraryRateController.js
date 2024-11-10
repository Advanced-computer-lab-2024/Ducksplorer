const express = require("express");
const Itinerary = require("../../Models/itineraryModel");
const mongoose = require('mongoose');
const ItineraryBooking = require("../../Models/itineraryBookingModel");

const rateItinerary = async (req, res) => {
    try {
        const { bookingId } = req.params; // Get booking ID from request parameters
        const { rating } = req.body; // Get rating from request body

        // Find the itinerary booking and itinerary document
        const itineraryBooking = await ItineraryBooking.findById(bookingId);
        if (!itineraryBooking) {
            return res.status(404).send("Itineraray Booking not found");
        }

        itineraryBooking.rating = rating
        await itineraryBooking.save();

        const itinerary = await Itinerary.findById(itineraryBooking.itinerary);

        if (!itinerary) return res.status(404).send("Itinerary not found");

        // Check if the rating for this bookingId exists
        const existingRating = itinerary.ratings.find(r => r.bookingId.toString() === bookingId);

        if (existingRating) {
            // Update existing rating
            existingRating.rating = rating;
        } else {
            // Add new rating
            itinerary.ratings.push({ bookingId, rating });
        }

        // Update the average rating
        const totalRating = itinerary.ratings.reduce((acc, r) => acc + r.rating, 0);
        itinerary.averageRating = totalRating / itinerary.ratings.length;

        await itinerary.save();

        res.status(200).json({
            updatedAverageRating: itinerary.averageRating,
            userRating: rating, // Return the user's specific rating
        });
    } catch (error) {
        console.error("Error updating rating:", error);
        res.status(500).send("Failed to update rating");
    }
};

module.exports = {
    rateItinerary,
};


module.exports = { rateItinerary }
//make sure this is correct