const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const filterItineraries = async (req, res) => {
    const { minPrice, maxPrice, availableDatesAndTimes, language } = req.query; //missing prefs waiting for wael to create table
    const filters = {};

    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) {
            filters.price.$gte = parseFloat(minPrice); 
        }
        if (maxPrice) {
            filters.price.$lte = parseFloat(maxPrice); 
        }
    }
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

const filterUpcomingItineraries = async (req, res) => {
    const { minPrice, maxPrice, availableDatesAndTimes, language } = req.query; //missing prefs waiting for wael to create table
    const filters = {};

    const currentDate = new Date(); // Gets the current date and time

    filters.availableDatesAndTimes = {
        $elemMatch: { $gt: currentDate } // Ensures dates are in the future
    };
    
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) {
            filters.price.$gte = parseFloat(minPrice); 
        }
        if (maxPrice) {
            filters.price.$lte = parseFloat(maxPrice); 
        }
    }
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

module.exports = {filterItineraries, filterUpcomingItineraries}