const express = require("express");

const router = express.Router();

const signUpRoutes = require("./signUpRoutes.js");
const itineraryRoutes = require("./itineraryRoutes.js");

router.use("/signUp", signUpRoutes);
router.use("/itinerary", itineraryRoutes);