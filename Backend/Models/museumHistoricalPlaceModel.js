const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//defines how the museumHistoricalPlace collection should look like 

const museumHistoricalPlaceSchema = new Schema({
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
    museumHistoricalPlaceDate: {
        type: Date,
        required: true
    },

    museumHistoricalPlaceName: {
        type: String,
        required: true
    },
    museumHistoricalPlaceCategory: {
        type: String,
        required: true
    },

    tags: {
        type: [String],
        required: false
    },
    createdBy: {
        type: String,  // Reference to the User model
        required: true //msh hanbayeno fel front end
    }


}, { timestamps: true })

const museumHistoricalPlace = mongoose.model("museumHistoricalPlace", museumHistoricalPlaceSchema);// write it singular cause it becomes plural
//this created model will be used in other files to interact with the museumHistoricalPlace collection

module.exports = museumHistoricalPlace;

//description, pictures, location, opening hours, ticket prices, museumHistoricalPlaceDate, museumHistoricalPlaceName, museumHistoricalPlaceCategory