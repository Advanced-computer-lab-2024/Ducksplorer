const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const touristModel = require("../../Models/touristModel");

const mongoose = require('mongoose');

const getUpcomingItineraries = async (req, res) => {
    const {showPreferences, username, role} = req.query;
    if(showPreferences === 'true'  && role === 'Tourist'){
        const tourist =await touristModel.findOne({userName: username});
        const touristTags = tourist.tagPreferences;

        try {
            const currentDate = new Date(); // Gets the current date and time
    
            let itineraries = await itineraryModel.find({
                availableDatesAndTimes: {
                    $elemMatch: { $gt: currentDate } // Checks if any element in the array is greater than the current date
                }
            });
    
            if (!itineraries.length) {
                return res.status(404).json({ error: "No upcoming itineraries found" });
            }
            itineraries = itineraries.sort((a, b) => {
                const aHasMatch = a.tags.some(tag => touristTags.includes(tag));
                const bHasMatch = b.tags.some(tag => touristTags.includes(tag));
                
                if (aHasMatch && !bHasMatch) {
                    return -1; // If 'a' has a match and 'b' doesn't, 'a' comes first
                  } else if (!aHasMatch && bHasMatch) {
                    return 1; // If 'b' has a match and 'a' doesn't, 'b' comes first
                  } else {
                    return 0; // If both have matches or both don't, retain their relative order
                  }            });
            res.status(200).json(itineraries);
    
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }else{
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
    }
    
};

module.exports = {getUpcomingItineraries};