const mongoose = require('mongoose');
const { schema } = require('./activityModel');
const Activity = require('./activityModel'); //anhy line el sah? 2 or 3 and it will reflect on line9
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
        type: String, //ask ehh da bezabt el timeline
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
    accessibility: { //ehh da ma3lesh?
        type: String,
        required: true
    },
    pickUpLocation: { //google maps bardo wala 3ady?
        type: String,
        required: true
    },
    dropOffLocation: { //google maps bardo wala 3ady?
        type: String,
        required: true
    },
    tourGuideModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TourGuide',
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
    flag: {
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
    timestamps: true
})

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;

//activities, locations to be visited, timeline, duration of each activity, language of tour, price of tour, available dates and times, accessibility, pick up/ drop off location.
