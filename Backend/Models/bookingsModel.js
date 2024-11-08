const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {activitySchema} = require('./activityModel.js');
const {itinerarySchema} = require('./itineraryModel.js');

const bookingsSchema = new Schema({
    user: {
      type: String,
      ref: 'Tourist',
      required: true
    },
    activities: {
        type: Array,
        schema: [activitySchema],
    },
    itineraries: {
        type: Array,
        schema: [itinerarySchema],
        required: false
    }
  }, { timestamps: true });

const Bookings = mongoose.model("Bookings", bookingsSchema);

module.exports = Bookings;
