const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const touristSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    userName:{
        type : String,
        required : true,
        unique : true,
        immutable : true
    },
    password:{
        type : String ,
        required :true
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
      default: "Egyptian", //error (Lazem tet7at gowa quotations)
    },
    DOB: 
       {type: Date, 
        default: Date.now , 
        get: (date)=> date.toLocaleDateString('en-GB'), 
        required: true}
    ,
    employmentStatus: {
      required: true,
      type: String,
    },
    wallet: {
        type: Number,
        required: true,
        default: 0,
        immutable: true // This makes the field read-only
    },
    favouriteCategory : {
      required : false,
      type : String,
      default : "Category"
    },
    tagPreferences : {
        type : Array,
        required : false
    }
  
},{timestamps: true})


const Tourist = mongoose.model("Tourist", touristSchema);

module.exports = Tourist;
