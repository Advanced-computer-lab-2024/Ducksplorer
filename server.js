require("dotenv").config(); //makes us read the env file
const express = require('express');
const mongoose = require('mongoose');// allows reads and write methods, allows us to create schemas which mongoDB does not give
const mongoose = require('mongoose');// allows reads and write methods, allows us to create schemas which mongoDB does not give
const app = express(); //el kol fel kol
const PORT = process.env.PORT || 8000; //tells us to get port from env file or law ma3refsh yegebha it's 3000
console.log(process.env.PORT);
app.use(express.json());//checks law ay request sent contains data bey pass it to the request object

const cors = require('cors');
app.use(cors());

// const signUpRoutes = require("./Backend/Routes/signUpRoutes.js");
const museumRoutes = require('./Backend/Routes/museumRoutes.js')
const historicalPlaceRoutes = require('./Backend/Routes/historicalPlaceRoutes.js')
const historicalPlaceTagRoutes = require('./Backend/Routes/historicalPlaceTagRoutes.js')
const museumTagRoutes = require('./Backend/Routes/museumTagRoutes.js')

// app.use("/signUp", signUpRoutes);
app.use("/museum", museumRoutes);
app.use("/historicalPlace", historicalPlaceRoutes);
app.use("/historicalPlaceTags", historicalPlaceTagRoutes);
app.use("/museumTags", museumTagRoutes);


const connectToMongoDB = async () => { //takes time to do
    try {
        await mongoose.connect(process.env.Ducksplorer_URI);//don't listen to request unless we are connected to DB
        await mongoose.connect(process.env.Ducksplorer_URI);//don't listen to request unless we are connected to DB
        console.log("Mongo Connected Successfully");
    }
    catch (error) {
    catch (error) {
        console.log("Error Connecting to MongoDB", error.message)
    }
}


app.listen(PORT, () => {
    connectToMongoDB();
    connectToMongoDB();
    console.log(`Server Running on Port ${PORT}`)
});













