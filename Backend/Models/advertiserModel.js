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
    nationalId:{
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
    taxationRegisteryCard:{
        type: String,
        required: true
    },
    logo:{
        type: String,
    }
},
    { timestamps: true })


const Advertiser = mongoose.model("Advertiser", advertiserSchema);

module.exports = Advertiser;
