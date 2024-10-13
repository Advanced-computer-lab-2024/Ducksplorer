const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingsSchema = new Schema({
    user: {
        type: String,
        ref:'Tourist',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    type: {
        type: String, 
        enum: ['itinerary', 'activity'], 
        required: true 
    }
    
})
const Bookings = mongoose.model("Bookings", bookingsSchema);

module.exports = Bookings;