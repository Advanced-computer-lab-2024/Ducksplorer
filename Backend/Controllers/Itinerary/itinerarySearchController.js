const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');

const searchItineraries = async (req, res) => {
    try {
        const { name, category } = req.query; //missing pref tags waiting for wael

        const searches = {};

        if (name || category) {
            searches.activities = {
                $elemMatch: {
                    $or: [
                        { name: { $regex: name, $options: 'i' } },
                        { category: { $regex: category, $options: 'i' } }
                    ]
                }
            };
        }
        const itineraries = await itineraryModel.find(searches);

        if (!itineraries.length) {
            return res.status(404).json({ error: "No itineraries found matching the search criteria" });
        }

        res.status(200).json(itineraries);
    }
    catch(error){
        res.status(500).json({ error: error.message });
    }
}

module.exports = { searchItineraries }