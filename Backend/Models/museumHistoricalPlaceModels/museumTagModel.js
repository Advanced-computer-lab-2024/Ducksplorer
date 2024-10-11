const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const museumTagSchema = new Schema({


    museumTag: {
        type: String,
        required: true
    },


}, { timestamps: true })

const museumTagModel = mongoose.model("museumTagModel", museumTagSchema);

module.exports = museumTagModel;

