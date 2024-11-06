const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const advertiserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    userName:{
        type : String,
        required : true,
        unique : true,
        immutable : true
    },
    password: {
        type: String,
        required: true
    },
    websiteLink: {
        type: String,
        required: true
    },
    hotline: {
        type: Number,
        required: true
    },
    companyProfile: {
        type: String,
        required: true
    },
    taxationRegisteryCard:
    {
        type: String,

    },
    nationalId: 
    {
        type: String,

    },
    logo:{
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
},
    { timestamps: true })


const Advertiser = mongoose.model("Advertiser", advertiserSchema);

module.exports = Advertiser;
