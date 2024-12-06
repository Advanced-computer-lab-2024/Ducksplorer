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
                { 'activity.category': { $regex: searchTerm, $options: 'i' } }, // Search in activity category
                { tags: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const itineraries = await itineraryModel.find(searches);

        if (itineraries.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(itineraries);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { searchItineraries };
