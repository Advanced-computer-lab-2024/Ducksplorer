const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new  Schema({
    role:{
        type : String,
        required : true
    },
    userName:{
        type : String,
        required : true,
        unique : true,
        immutable : true
    },
    password :{
        type : String ,
        required :true
    },
    status:{
        type : String,
        required : true
    }
},{timestamps: true})


const User = mongoose.model("User",userSchema);


module.exports = User;


