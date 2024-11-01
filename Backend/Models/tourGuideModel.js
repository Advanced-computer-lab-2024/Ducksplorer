const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileModel = require('./fileModel');

const tourGuideSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    password: {
        type: String,
        required: true
    },
    nationalId:
    {
        type: Array,
        schema: [fileModel],
        required: true
    },
    // {
    //     type: Buffer,
    //     required: true
    // },
    mobileNumber: {
        type: Number,
        required: true
    },
    yearsOfExperience: {
        type: Number,
        required: true
    },
    previousWork: {
        type: String,
        required: false
    }, 
    certificates:
    {
        type: Array,
        schema: [fileModel],
        required: true
    },
    // {
    //     type: Buffer,
    //     required: true
    // },
    photo:{
        type: String,
    }
}, { timestamps: true })

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);

module.exports = TourGuide;

