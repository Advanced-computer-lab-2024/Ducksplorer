const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const sortItineraries = async (req, res) => {
    try {
        const { sortBy } = req.query; // get the sortBy parameter from the query
        //ask law nezawed option ascending w descending or not 
        let sortOption = {};
        if (sortBy === 'price') {
            sortOption.price = 1; // 1 for ascending, -1 for descending
        } else if (sortBy === 'rating') {
            sortOption.rating = -1; // -1 for descending (higher ratings first)
        }
        const itineraries = await itineraryModel.find({}).sort(sortOption);
        res.status(200).json(itineraries);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching itineraries', error });
    }
};

module.exports = { sortItineraries };
