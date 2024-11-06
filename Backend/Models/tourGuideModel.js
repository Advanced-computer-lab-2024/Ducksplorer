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
        required: false
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
        required: false
    },
    // {
    //     type: Buffer,
    //     required: true
    // },
    photo:{
        type: String,
    },
    profilePicture: {
        filename: { type: String },
        filepath: { type: String },
        uploadedAt: { type: Date },
      },
    files: [
        {
          filename: String,
          filepath: String,
          uploadedAt: { type: Date, default: Date.now },
        },
      ],
}, { timestamps: true })

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);

module.exports = TourGuide;

