const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferenceTagsSchema = new Schema({
    name:{
        type : String,
        required : true,
        unique : true
    }
},{timestamps: true})


const preferenceTags = mongoose.model("PreferenceTag", preferenceTagsSchema);
module.exports = preferenceTags;
