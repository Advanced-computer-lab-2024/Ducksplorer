const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileModel = require('./fileModel');

const sellerSchema = new Schema({
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
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    taxationRegisteryCard:
    {
        type: Array,
        schema: [fileModel],
        required: true
    },
    // {
    //     type: Buffer,
    //     required: true
    // },
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


const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;