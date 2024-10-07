const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityCategorySchema = new Schema ({
    name:{
        type : String,
        unique : true,
        required : true
    },
    activities:{
        type : [String], //da lel activity names only msh el activity shakhseyan
        required : true,
        default : []

    }   
},{timestamps: true})

const ActivityCategory = mongoose.model("ActivityCategory",activityCategorySchema);

module.exports = ActivityCategory;
