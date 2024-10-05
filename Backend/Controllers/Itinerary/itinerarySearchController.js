// const express = require("express");
// const itineraryModel = require("../../Models/itineraryModel");
// const mongoose = require('mongoose');
// const { $elemMatch } = require("sift");

// const searchItineraries = async (req, res) => {
//     try {
//         const { name, category } = req.query; //missing pref tags waiting for wael

//         const searches = {};

//         if (name){
//             searches['activity.name'] =  {$regex: name, $options: 'i'}
//         }
        
//         if(category){
//             searches['activity.category'] = { $regex: category, $options: 'i'}
//         }

//         const itineraries = await itineraryModel.find(searches);

//         if (!itineraries.length) {
//             return res.status(404).json({ error: "No itineraries found matching the search criteria" });
//         }

//         res.status(200).json(itineraries);
//     }
//     catch(error){
//         res.status(500).json({ error: error.message });
//     }
// }

// module.exports = { searchItineraries }

const express = require("express");
const itineraryModel = require("../../Models/itineraryModel");
const mongoose = require('mongoose');
const { $elemMatch } = require("sift");

const searchItineraries = async (req, res) => {
    try {
        const { searchTerm } = req.query; // Use searchTerm for both name and category

        const searches = {};

        if (searchTerm) {
            // Use $or to search in both 'activity.name' and 'activity.category' fields
            searches['$or'] = [
                { 'activity.name': { $regex: searchTerm, $options: 'i' } },   // Search in activity name
                { 'activity.category': { $regex: searchTerm, $options: 'i' } } // Search in activity category
            ];
        }

        const itineraries = await itineraryModel.find(searches);

        if (!itineraries.length) {
            return res.status(404).json({ error: "No itineraries found matching the search criteria" });
        }

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { searchItineraries };
