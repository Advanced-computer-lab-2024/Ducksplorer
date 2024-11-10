const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const thirdPartyBookingsSchema = new Schema({

    user: {
        type: String,
        ref: 'Tourist',
        required: true
    },
    hotels: {
        type: Schema.Types.Mixed,
    },
    flights: {
        type: Schema.Types.Mixed,
    },
    transportations: {
        type: Schema.Types.Mixed,
    }
}, { timestamps: true });

const ThirdPartyBookings = mongoose.model("ThirdPartyBookings", thirdPartyBookingsSchema);

module.exports = ThirdPartyBookings;