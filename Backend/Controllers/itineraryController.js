const express = require("express");
const itineraryModel = require("../Models/itineraryModel")
const mongoose = require('mongoose');

//router.post("/", authentication.signUp);

const createItinerary = async (req, res) => {
    //add a new itinerary to the database with 
    //activity,locations,timeline,language,price,availableDates,availableTimes,accessibility,pickUpLocation,dropOffLocation
    const { activity, locations, timeline, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;
    console.log(req.body);
    try {
        const itinerary = await itineraryModel.create({ activity, locations, timeline, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation });
        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getAllItineraries = async (req, res) => {
    //retrieve all Itineraries from the database
    try {
        const itinerary = await itineraryModel.find();
        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message, x: "oops" });
    }
}

const getItinerary = async (req, res) => {
    //retrieve all Itineraries from the database
    try {
        const { id } = req.params;
        const { activity, locations, timeline, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID invalid" });
        }
        const itinerary = await itineraryModel.findByIdAndUpdate(id, { activity, locations, timeline, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation });
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }
        res.status(200).json(itinerary);
    }
    catch (error) {
        res.status(400).json({ error: error.message, x: "oops" });
    }
}

const updateItinerary = async (req, res) => {
    //update a itinerary in the database
    console.log(req.body);
    try {
        const { id } = req.params;
        const { activity, locations, timeline, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID invalid" });
        }
        const itinerary = await itineraryModel.findByIdAndUpdate(id, { activity, locations, timeline, language, price, availableDates, availableTimes, accessibility, pickUpLocation, dropOffLocation });
        if (!itinerary) {
            return res.status(404).json({ error: "Itinerary not found" });
        }
        res.status(200).json({ itinerary, x: "Itinerary updated" });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteItinerary = async (req, res) => {
    //delete a itinerary from the database
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