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
        type: Number,
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
        schema: [museumTag],//this is an array of objects of type museumTag created using the model of museumTagModel
        required: false //because a museum is not obliged to have tags
    },
    createdBy: {
        type: String,
        required: true
    }


}, { timestamps: true })

const museumModel = mongoose.model("museumModel", museumSchema);// write it singular cause it becomes plural


module.exports = museumModel;

