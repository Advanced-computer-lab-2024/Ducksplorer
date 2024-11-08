const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityBookingSchema = new Schema({
    user: {
        type: String,
        ref: 'Tourist',
        required: true
    },
    activity: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    },
    chosenDate: {
        type: Date,
        required: true
    },
    chosenPrice: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const ActivityBooking = mongoose.model("ActivityBooking", activityBookingSchema);

module.exports = ActivityBooking;
