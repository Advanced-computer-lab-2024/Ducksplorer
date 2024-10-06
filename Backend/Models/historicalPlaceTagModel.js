const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const historicalPlaceTagSchema = new Schema({

    historicalPlaceTag: {
        type: String,
        required: true
    },


}, { timestamps: true })

const historicalPlaceTagModel = mongoose.model("historicalPlaceTagModel", historicalPlaceTagSchema);

module.exports = historicalPlaceTagModel;

