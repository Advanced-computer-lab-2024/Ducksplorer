const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    ,
    ratings: {
        type: [Number],
        required: false
    },
    averageRating: {
        type: Number,
        required: false
    },
    comments: {
        type: [String],
        required: false,
    }
}, { timestamps: true })

const TourGuide = mongoose.model("TourGuide", tourGuideSchema);

module.exports = TourGuide;

