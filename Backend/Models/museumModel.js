const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const museumTag = require('./museumTagModel');

const museumSchema = new Schema({
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
    museumDate: {
        type: Date,
        required: true
    },

    museumName: {
        type: String,
        required: true
    },
    museumCategory: {
        type: String,
        required: true
    },

    tags: {
        type: Array,
        schema:[museumTag],
        required: false
    },
    // tags: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'museumTagModel' // Reference to the museumTagModel
    // }],
    
    createdBy: {
        type: String,
        required: true
    }


}, { timestamps: true })

const museumModel = mongoose.model("museumModel", museumSchema);// write it singular cause it becomes plural


module.exports = museumModel;

//description, pictures, location, opening hours, ticket prices, museumDate, museumName, museumCategory