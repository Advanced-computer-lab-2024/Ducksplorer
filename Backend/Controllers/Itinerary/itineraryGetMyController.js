const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const getAllMyItineraries = async (req, res) => {
    try{
        const { tourGuideModel } = req.query;
        const itinerary = await itineraryModel.find({tourGuideModel});
        res.status(200).json(itinerary);
    }
    catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = { getAllMyItineraries }
//make sure this is correct