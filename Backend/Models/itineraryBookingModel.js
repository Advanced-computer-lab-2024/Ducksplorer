const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itineraryBookingSchema = new Schema({
    user: {
        type: String,
        ref: 'Tourist',
        required: true
    },
    itinerary: {
        type: Schema.Types.ObjectId,
        ref: 'Itinerary',
        required: true
    },
    chosenDate: {
        type: Date,
    },
    chosenPrice: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        required: false
    },
    comment: {
        type: String,
        default: "",
        required: false
    }
}, { timestamps: true });

const ItineraryBooking = mongoose.model("ItineraryBooking", itineraryBookingSchema);

module.exports = ItineraryBooking;
