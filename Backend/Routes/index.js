const express = require("express");

const router = express.Router();

const signUpRoutes = require("./signUpRoutes.js");
const ItineraryRoutes = require("./itineraryRoutes.js");

router.use("/signUp", signUpRoutes);
router.use("/itinerary", ItineraryRoutes);