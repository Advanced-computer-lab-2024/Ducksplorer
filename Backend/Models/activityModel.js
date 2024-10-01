const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema ({
    date:{
        type : Date,
        required : true
    },
    time:{
        type : String, //mafeesh time data type bas momken ne match le certain way of writing HH:MM
        //match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:MM']
        required : true
    },
    location :{
        type : String , //link le google maps masalan
        required :true
    },
    price:{
        type : Number, 
        required : false
    },
    minPrice:{ //ask noha law el range yetfekes
        type : Number, 
        required : false 
    },
    maxPrice:{ //we'll make one of these only required bas fel frontend
        type : Number, 
        required : false
    },
    category:{
        type : String,
        required : true
    },
    tags:{
        type: String,
        required: true
    },
    specialDiscount:{
        type: Number,
        required: false //ask noha law msh required
    },
    duration: { //make it required fel frontend
        type: Number,
        required: false
    }
},{timestamps: true})

const Activity = mongoose.model("Activity",activitySchema);

module.exports = Activity;

//date, time, location (using Google Maps), price (or price range), category, tags, special discounts, if booking is open

