const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    nationalId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
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


const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;