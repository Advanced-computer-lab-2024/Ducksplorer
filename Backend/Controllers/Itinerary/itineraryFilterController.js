const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const filterItineraries = async (req, res) => {
    const { price, availableDatesAndTimes, language } = req.query; //missing prefs waiting for wael to create table
    const filters = {};

    if (price) 
        filters.price = price;
    if (language) 
        filters.language = language;
    if (availableDatesAndTimes) {
        const dateQuery = new Date(availableDatesAndTimes); // Convert the query date string to a Date object

        filters.availableDatesAndTimes = { 
            $elemMatch: { $eq: dateQuery } // Check for exact match of the date
        };
    }

    try {
        const itineraries = await itineraryModel.find(filters);
        res.status(200).json(itineraries)
    }
    catch(error){
        res.status(400).json({error:error.message});
    }
}

module.exports = {filterItineraries}