require("dotenv").config(); //makes us read the env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express(); //el kol fel kol
const PORT = process.env.PORT || 8000; //tells us to get port from env file or law ma3refsh yegebha it's 3000

console.log(process.env.PORT );
app.use(express.json());
app.use(cors());

const signUpRoutes = require("./Backend/Routes/signUpRoutes.js");
const adminRoutes = require("./Backend/Routes/Admin/AdminRoutes.js");
const touristAccountRoutes = require("./Backend/Routes/TouristAccountRoutes.js");
const AdminActivityRoutes = require("./Backend/Routes/Admin/AdminActivityRoutes.js");

app.use("/signUp", signUpRoutes);
app.use("/admin", adminRoutes);
app.use("/touristAccount", touristAccountRoutes);
app.use("/adminActivity", AdminActivityRoutes);


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













