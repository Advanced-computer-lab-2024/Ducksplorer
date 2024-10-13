const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');
const tourGuideModel = require("../../Models/tourGuideModel");


const createItinerary = async (req, res) => { //create
    //add a new itinerary to the database with 
    //activity,locations,timeline,language,price,availableDates,availableTimes,accessibility,pickUpLocation,dropOffLocation
    const { activity, locations, timeline, language, price, availableDatesAndTimes, accessibility, pickUpLocation, dropOffLocation, tourGuideUsername, rating, tags, flag } = req.body;
    console.log(req.body);
    try {
        //first get id of tour guide from his username
        const tourGuide = await tourGuideModel.findOne({ userName: tourGuideUsername });

        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour guide not found' });
        }

        const itinerary = await itineraryModel.create({
            activity, locations, timeline, language, price,
            availableDatesAndTimes, accessibility, pickUpLocation, dropOffLocation, tourGuideModel: tourGuide._id, rating, tags, flag
        });

        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllItineraries = async (req, res) => { //helper
    //retrieve all Itineraries from the database
    try {
        const itinerary = await itineraryModel.find();
        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message, x: "oops" });
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

const toggleFlagItinerary = async (req, res) => {
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
        itinerary.flag = !itinerary.flag; // Set flag to the opposite of its current value

        // Save the updated itinerary because it is not just changed in memory not on server
        const updatedItinerary = await itinerary.save();

        res.status(200).json({
            itinerary: updatedItinerary,
            message: `Itinerary flagged as ${updatedItinerary.flag ? "inappropriate" : "appropriate"}`,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



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


module.exports = { createItinerary, getItinerary, deleteItinerary, updateItinerary, getAllItineraries, toggleFlagItinerary };