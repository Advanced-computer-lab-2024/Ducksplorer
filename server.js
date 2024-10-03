require("dotenv").config(); //makes us read the env file
const express = require('express');
const mongoose = require('mongoose');
const app = express(); //el kol fel kol
const PORT = process.env.PORT || 8000; //tells us to get port from env file or law ma3refsh yegebha it's 3000
const cors = require('cors');

console.log(process.env.PORT);
app.use(express.json());
app.use(cors({ origin: 'http://localhost:8000' })); // Adjust if needed

const signUpRoutes = require("./Backend/Routes/signUpRoutes.js");
const itineraryRoutes = require("./Backend/Routes/itineraryRoutes.js")

app.use("/signUp", signUpRoutes);
app.use("/itinerary", itineraryRoutes);


const connectToMongoDB = async () => {
    try {
        await mongoose.connect(process.env.Ducksplorer_URI);
        console.log("Mongo Connected Successfully");
    }
    catch (error) {
        console.log("Error Connecting to MongoDB", error.message)
    }
}

app.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Server Running on Port ${PORT}`)
});

