const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');
const tourGuideModel = require("../../Models/tourGuideModel");
const touristModel = require("../../Models/touristModel");


const createItinerary = async (req, res) => { //create
    //add a new itinerary to the database with 
    //activity,locations,timeline,language,price,availableDates,availableTimes,accessibility,pickUpLocation,dropOffLocation
    const { activity, locations, timeline, language, price, availableDatesAndTimes, accessibility, pickUpLocation, dropOffLocation, tourGuideUsername, rating, tags } = req.body;
    console.log(req.body);
    try {
        //first get id of tour guide from his username
        const tourGuide = await tourGuideModel.findOne({ userName: tourGuideUsername });

        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        const itinerary = await itineraryModel.create({
            activity, locations, timeline, language, price,
            availableDatesAndTimes, accessibility, pickUpLocation, dropOffLocation, tourGuideModel: tourGuide._id, rating, tags
        });

        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllItineraries = async (req, res) => { //helper
    //retrieve all Itineraries from the database
    const {showPreferences, username, role} = req.query;
    if(showPreferences === 'true' && role === 'Tourist'){
        const tourist =await touristModel.findOne({userName: username});
        const touristTags = tourist.tagPreferences;
        try {
            let itineraries = await itineraryModel.find();
             // Sort itineraries based on matching tags with the tourist's tags
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
        }
        catch (error) {
            res.status(400).json({ error: error.message, x: "oops" });
        }
    }else{
        try {
            const itinerary = await itineraryModel.find();
            res.status(200).json(itinerary);
        }
        catch (error) {
            res.status(400).json({ error: error.message, x: "oops" });
        }
    }
}

const getItinerary = async (req, res) => { //read
    //retrieve an Itinerary from the database
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID invalid" });
        }
        const itinerary = await itineraryModel.findById(id);
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }
        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message, x: "oops" });
    }
}

const updateItinerary = async (req, res) => { //update
    //update an itinerary in the database
    console.log(req.body);
    try {
        const { id } = req.params;
        const { activity, locations, timeline, language, price, availableDatesAndTimes, accessibility, pickUpLocation, dropOffLocation, rating, tags } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID invalid" });
        }
        const itinerary = await itineraryModel.findByIdAndUpdate(id, { activity, locations, timeline, language, price, availableDatesAndTimes, accessibility, pickUpLocation, dropOffLocation, rating, tags });
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }
        res.status(200).json({ itinerary, x: "Itinerary updated" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteItinerary = async (req, res) => { //delete
    //delete an itinerary from the database
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID invalid" });
        }
        const itinerary = await itineraryModel.findByIdAndDelete(id);
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }
        res.status(200).json({ message: "Itinerary deleted" });

    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = { createItinerary, getItinerary, deleteItinerary, updateItinerary, getAllItineraries };