const mongoose = require('mongoose');
const { schema } = require('./activityModel');
const Activity = require('./activityModel'); //anhy line el sah? 2 or 3 and it will reflect on line9
const Schema = mongoose.Schema;
const TourGuide = require('./tourGuideModel');

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
    price: { //ask noha law el range yetfekes
        type: Number,
        required: true
    },
    availableDates: {
        type: String, //ask law fi date
        required: true
    },
    availableTimes: {
        type: String, //ask law fi time
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
        type: mongoose.Schema.Types.ObjectId, // Assuming a reference to a User model
        ref: 'TourGuide',
        required: false
    }
}, { timestamps: true })

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

module.exports = Itinerary;

//activities, locations to be visited, timeline, duration of each activity, language of tour, price of tour, available dates and times, accessibility, pick up/ drop off location.
