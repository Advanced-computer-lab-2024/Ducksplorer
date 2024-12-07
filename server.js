require("dotenv").config(); //makes us read the env file
const express = require("express");
const mongoose = require("mongoose");
const app = express(); //el kol fel kol
const PORT = process.env.PORT || 8000; //tells us to get port from env file or law ma3refsh yegebha it's 3000
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const protectRoute = require("./Backend/Middleware/protectRoute.js");
const touristRoutes = require("./Backend/Routes/touristRoutes.js");
const sellerRoutes = require("./Backend/Routes/sellerRoutes.js");
const adminProductRoutes = require("./Backend/Routes/adminRoutes.js");
const multer = require("multer");
const signUpRoutes = require("./Backend/Routes/signUpRoutes.js");
const adminRoutes = require("./Backend/Routes/Admin/AdminRoutes.js");
const touristAccountRoutes = require("./Backend/Routes/TouristAccountRoutes.js");
const AdminActivityRoutes = require("./Backend/Routes/Admin/AdminActivityRoutes.js");
const preferenceTagsRoutes = require("./Backend/Routes/Admin/PreferenceTagsRoutes.js");
const activityRoutes = require("./Backend/Routes/activityRoutes.js");
const categoryRoutes = require("./Backend/Routes/categoryRoutes.js");
const fileRoutes = require("./Backend/Routes/fileRoutes.js");
const paymentRoutes = require("./Backend/Routes/paymentRoutes.js");
const userRoutes = require("./Backend/Routes/userRoutes.js");
const bodyParser = require("body-parser");
const bookingThirdPartyRoutes = require("./Backend/Routes/ThirdParty/bookingRoutes.js");
const documentRoutes = require("./Backend/Routes/documentRoutes");
const museumRoutes = require("./Backend/Routes/museumHistoricalPlaceRoutes/museumRoutes.js");
const historicalPlaceRoutes = require("./Backend/Routes/museumHistoricalPlaceRoutes/historicalPlaceRoutes.js");
const historicalPlaceTagRoutes = require("./Backend/Routes/museumHistoricalPlaceRoutes/historicalPlaceTagRoutes.js");
const museumTagRoutes = require("./Backend/Routes/museumHistoricalPlaceRoutes/museumTagRoutes.js");
const itineraryRoutes = require("./Backend/Routes/itineraryRoutes.js");
const tourGuideAccountRoutes = require("./Backend/Routes/TourGuideAccountRoutes.js");
const advertiserAccountRoutes = require("./Backend/Routes/AdvertiserAccountRoutes.js");
const sellerAccountRoutes = require("./Backend/Routes/SellerAccountRoutes.js");
const transportationBookingThirdPartyRoutes = require("./Backend/Routes/ThirdParty/transportationBookingRoutes.js");
const complaintRoutes = require("./Backend/Routes/complaintRoutes.js");
const uploadImage = require("./Backend/Middleware/uploadImageMW.js");
const notificationRoutes = require("./Backend/Routes/Notifications/NotificationRoutes.js");
const cron = require("node-cron");
const PurchaseBooking = require("./Backend/Models/purchaseBookingModel.js");

app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));

//__dirname = path.dirname(fileURLToPath(import.meta.url)); // Set __dirname
app.use(
  "/uploads",
  (req, res, next) => {
    console.log("Static file request:", req.url);
    next();
  },
  express.static(path.join(__dirname, "uploads"))
);

app.use(bodyParser.json());
//app.use("/uploads", express.static("uploads"));

app.use(cookieParser());

console.log(process.env.PORT);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename with the correct extension
  },
});

app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.send(url))
    .catch((err) => res.status(500).send(err.message));
});

//update order status automatically every 24h
cron.schedule("0 0 * * *", async () => {
  const now = new Date();
  try {
    console.log("Running scheduled task to update order statuses...");

    // Update "Processing" orders to "Delivering"
    const processingOrders = await PurchaseBooking.find({
      status: "Processing",
      createdAt: { $lte: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
    });

    for (const order of processingOrders) {
      order.status = "Delivering";
      // consol.log(order);
      await order.save();
    }

    // Update "Delivering" orders to "Delivered"
    const deliveringOrders = await PurchaseBooking.find({
      status: "Delivering",
      createdAt: { $lte: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
    });

    for (const order of deliveringOrders) {
      order.status = "Delivered";
      await order.save();
    }

    console.log(
      `Task completed: ${processingOrders.length} orders updated to Delivering, ${deliveringOrders.length} orders updated to Delivered.`
    );
  } catch (error) {
    console.error("Error during scheduled task:", error);
  }
});

const tourGuideRateRoutes = require("./Backend/Routes/tourGuideRateRoutes.js");
const tourGuideCommentRoutes = require("./Backend/Routes/tourGuideCommentRoutes.js");

app.use("/signUp", signUpRoutes);
app.use("/touristRoutes", touristRoutes);
app.use("/sellerRoutes", sellerRoutes);
app.use("/adminRoutes", adminProductRoutes);
app.use("/activity", activityRoutes);
app.use("/admin", adminRoutes);
app.use("/touristAccount", touristAccountRoutes);
app.use("/adminActivity", AdminActivityRoutes);
app.use("/preferenceTags", preferenceTagsRoutes);
app.use("/category", categoryRoutes);
app.use("/museum", museumRoutes);
app.use("/historicalPlace", historicalPlaceRoutes);
app.use("/historicalPlaceTags", historicalPlaceTagRoutes);
app.use("/museumTags", museumTagRoutes);
app.use("/itinerary", itineraryRoutes);
app.use("/tourGuideAccount", tourGuideAccountRoutes);
app.use("/advertiserAccount", advertiserAccountRoutes);
app.use("/sellerAccount", sellerAccountRoutes);
app.use("/file", fileRoutes);
app.use("/payment", paymentRoutes);
app.use("/complaint", complaintRoutes);
app.use("/users", userRoutes);
app.use("/", bookingThirdPartyRoutes);
app.use("/api/documents", documentRoutes);
// app.use("/", bookingThirdPartyRoutes);
app.use("/tourGuideRate", tourGuideRateRoutes);
app.use("/tourGuideComment", tourGuideCommentRoutes);
app.use("/transportBook", transportationBookingThirdPartyRoutes);
app.use("/notification", notificationRoutes);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Allow requests from any origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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
  console.log(`Server Running on Port ${PORT}`);
});
