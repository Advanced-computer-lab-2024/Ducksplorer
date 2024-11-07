const mongoose = require('mongoose');
const { schema } = require('./activityModel'); // This line is correct
const Activity = require('./activityModel');
const Schema = mongoose.Schema;
const TourGuide = require('./tourGuideModel');
const Tags = require('./preferenceTagsModels');

const itinerarySchema = new Schema({
    activity: {
        type: Array,
        schema: [Activity],
        required: true
    },
    locations: {
        type: Array,
        schema: [String],
        required: true
    },
    timeline: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availableDatesAndTimes: {
        type: [Date],
        required: true
    },
    accessibility: {
        type: String,
        required: true
    },
    pickUpLocation: {
        type: String,
        required: true
    },
    dropOffLocation: {
        type: String,
        required: true
    },
    tourGuideModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourGuide',
        required: false
    },
    bookedCount: {
        type: Number,
        default: 0,
        required: false
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: false,
        default: 0
    },
    tags: {
        type: [String],
        required: false
    },
    chosenDate: {
        type: Date,
        required: false
    },
    flag: {
        type: Boolean,
        required: false
    },
    isActive: {
        type: Boolean,
        required: false
    },
    ratings: {
        type: [Number],
        required: false
    },
    averageRating: {
        type: Number,
        required: false
    },
    comments: {
        type: [String],
        required: false,
    },
    bookedCount: {
        type: Number,
        default: 0,
        required: false
    },
}, { timestamps: true }); // Moved `timestamps` to schema options here

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;