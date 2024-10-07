const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const historicalPlaceTag = require('./historicalPlaceTagModel');

const HistoricalPlaceSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    pictures: {
        type: [String],
        required: true
    },
    location: {
        type: String, //link le google maps masalan
        required: true
    },
    ticketPrices: {
        type: Array,
        schema: [Number],
        required: false
    },
    openingTime: {
        type: Number, //check law fi type time
        required: true
    },
    closingTime: {
        type: Number,
        required: true
    },
    HistoricalPlaceDate: {
        type: Date,
        required: true
    },

    HistoricalPlaceName: {
        type: String,
        required: true
    },
    HistoricalPlaceCategory: {
        type: String,
        required: true
    },

    tags: {
        type:Array,
        schema:[historicalPlaceTag],
        required: false
    },
    createdBy: {
        type: String,  
        required: true 
    }


}, { timestamps: true })

const HistoricalPlace = mongoose.model("HistoricalPlace", HistoricalPlaceSchema);// write it singular cause it becomes plural
module.exports = HistoricalPlace;

//description, pictures, location, opening hours, ticket prices, HistoricalPlaceDate, HistoricalPlace, HistoricalPlaceCategory