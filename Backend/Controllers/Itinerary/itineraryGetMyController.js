const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const TourGuide = require('../../Models/tourGuideModel');
const mongoose = require('mongoose');

const getAllMyItineraries = async (req, res) => {
    try{
        const { userName } = req.params;

        //find the tour guide by his username which is given as a parameter
        const tourGuide = await TourGuide.findOne({ userName: userName });

        //then find the itinerary using the tour guide id
        if (!tourGuide) {
            return res.status(404).json({ error: 'Tour Guide not found' });
        }

        const itinerary = await itineraryModel.find({ tourGuideModel: tourGuide._id });
        res.status(200).json(itinerary);
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getAllMyItineraries }
//make sure this is correct