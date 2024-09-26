const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tourGuideSchema = new Schema ({
    email:{
        type : String,
        required : true
    },
    userName:{
        type : String,
        required : true
    },
    password :{
        type : String ,
        required :true
    },
    mobileNumber:{
        type : Number,
        required : true
    },
    yearsOfExperience:{
        type : Number,
        required : true
    },
    previousWork:{
        type: String,
        required: false
    }
},{timestamps: true})

const TourGuide = mongoose.model("TourGuide",tourGuideSchema);

module.exports = TourGuide;

