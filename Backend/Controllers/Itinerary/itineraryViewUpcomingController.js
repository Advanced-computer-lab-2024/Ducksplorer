const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const getUpcomingItineraries = async (req, res) => {
    try {
        const currentDate = new Date(); // Gets the current date and time

        const itineraries = await itineraryModel.find({
            availableDatesAndTimes: {
                $elemMatch: { $gt: currentDate } // Checks if any element in the array is greater than the current date
            }
        });

        if (!itineraries.length) {
            return res.status(404).json({ error: "No upcoming itineraries found" });
        }

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {getUpcomingItineraries};