require("dotenv").config(); //makes us read the env file
const express = require("express");
const mongoose = require("mongoose");
const app = express(); //el kol fel kol
const PORT = process.env.PORT || 8000; //tells us to get port from env file or law ma3refsh yegebha it's 3000
const cors = require('cors');
const touristRoutes = require('./Backend/Routes/touristRoutes.js');
const sellerRoutes = require('./Backend/Routes/sellerRoutes.js');
const adminProductRoutes = require('./Backend/Routes/adminRoutes.js');
const signUpRoutes = require("./Backend/Routes/signUpRoutes.js");
const adminRoutes = require("./Backend/Routes/Admin/AdminRoutes.js");
const touristAccountRoutes = require("./Backend/Routes/TouristAccountRoutes.js");
const AdminActivityRoutes = require("./Backend/Routes/Admin/AdminActivityRoutes.js");
const preferenceTagsRoutes = require("./Backend/Routes/Admin/PreferenceTagsRoutes.js");
const activityRoutes = require("./Backend/Routes/activityRoutes.js");
const categoryRoutes = require("./Backend/Routes/categoryRoutes.js");
const fileRoutes = require("./Backend/Routes/fileRoutes.js")

app.use(cors());

app.use('/uploads', express.static('uploads'));



console.log(process.env.PORT);
app.use(express.json());



const museumRoutes = require('./Backend/Routes/museumHistoricalPlaceRoutes/museumRoutes.js')
const historicalPlaceRoutes = require('./Backend/Routes/museumHistoricalPlaceRoutes/historicalPlaceRoutes.js')
const historicalPlaceTagRoutes = require('./Backend/Routes/museumHistoricalPlaceRoutes/historicalPlaceTagRoutes.js')
const museumTagRoutes = require('./Backend/Routes/museumHistoricalPlaceRoutes/museumTagRoutes.js')
const itineraryRoutes = require("./Backend/Routes/itineraryRoutes.js")
const tourGuideAccountRoutes = require("./Backend/Routes/TourGuideAccountRoutes.js")
const advertiserAccountRoutes = require("./Backend/Routes/AdvertiserAccountRoutes.js")
const sellerAccountRoutes = require("./Backend/Routes/SellerAccountRoutes.js");
const { DriveFileRenameOutlineSharp } = require("@mui/icons-material");


app.use("/signUp", signUpRoutes);
app.use("/touristRoutes", touristRoutes);
app.use("/sellerRoutes", sellerRoutes);
app.use("/adminRoutes", adminProductRoutes);
app.use("/activity", activityRoutes);
app.use("/admin", adminRoutes);
app.use("/touristAccount", touristAccountRoutes);
app.use("/adminActivity", AdminActivityRoutes);
app.use("/preferenceTags", preferenceTagsRoutes);
app.use("/category", categoryRoutes); app.use("/museum", museumRoutes);
app.use("/historicalPlace", historicalPlaceRoutes);
app.use("/historicalPlaceTags", historicalPlaceTagRoutes);
app.use("/museumTags", museumTagRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/tourGuideAccount", tourGuideAccountRoutes);
app.use("/advertiserAccount", advertiserAccountRoutes);
app.use("/sellerAccount", sellerAccountRoutes);
app.use('/file', fileRoutes);


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});


const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.Ducksplorer_URI);
    console.log("Mongo Connected Successfully");
  } catch (error) {
    console.log("Error Connecting to MongoDB", error.message);
  }
};

app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on Port ${PORT}`)
});

