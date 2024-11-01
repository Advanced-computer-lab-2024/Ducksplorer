const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { activitySchema } = require('./activityModel.js');
const { itinerarySchema } = require('./itineraryModel.js');

const bookingsSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourist',
        required: true
    },
    activities: {
        type: Array,
        schema: [activitySchema],//this is an array of objects of type museumTag created using the model of museumTagModel
        required: false
    },
    itineraries: {
        type: Array,
        schema: [itinerarySchema],//this is an array of objects of type museumTag created using the model of museumTagModel
        required: false
    }
}, { timestamps: true });

const Bookings = mongoose.model("Bookings", bookingsSchema);

module.exports = Bookings;