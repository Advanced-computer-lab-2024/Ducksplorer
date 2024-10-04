require("dotenv").config(); //makes us read the env file
const express = require('express');
const mongoose = require('mongoose');
const app = express(); //el kol fel kol
const PORT = process.env.PORT || 8000; //tells us to get port from env file or law ma3refsh yegebha it's 8000
const touristRoutes = require('./Backend/Routes/touristRoutes.js');
const sellerRoutes = require('./Backend/Routes/sellerRoutes.js');
const adminRoutes = require('./Backend/Routes/adminRoutes.js');
const signUpRoutes = require("./Backend/Routes/signUpRoutes.js");

app.use('/uploads', express.static('uploads'));

const cors = require('cors');
app.use(cors());

console.log(process.env.PORT );
app.use(express.json());
app.use("/signUp", signUpRoutes);
app.use("/touristRoutes",touristRoutes);
app.use("/sellerRoutes", sellerRoutes);
app.use("/adminRoutes", adminRoutes);



const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.Ducksplorer_URI);
        console.log("Mongo Connected Successfully");
    }
    catch(error){
        console.log("Error Connecting to MongoDB", error.message)
    }
}

app.listen(PORT, () => {
    connectToMongoDB(); 
    console.log(`Server Running on Port ${PORT}`)
});













