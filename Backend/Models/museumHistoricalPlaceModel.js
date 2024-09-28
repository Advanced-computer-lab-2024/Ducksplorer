const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const museumHistoricalPlaceSchema = new Schema ({
    description:{
        type : String,
        required : true
    },
    pictures:{
        type : String, //check law el pic hayeb2a string path masalan wala ehh
        required : true
    },
    location :{
        type : String , //link le google maps masalan
        required :true
    },
    ticketPrices:{
        type : Array,
        schema: [Number], 
        required : false
    },
    openingTime:{
        type : Number, //check law fi type time
        required : true
    },
    closingTime:{
        type: Number,
        required: true
    }
},{timestamps: true})

const MuseumHistoricalPlace = mongoose.model("MuseumHistoricalPlace", museumHistoricalPlaceSchema);

module.exports = MuseumHistoricalPlace;

//description, pictures, location, opening hours, ticket prices
