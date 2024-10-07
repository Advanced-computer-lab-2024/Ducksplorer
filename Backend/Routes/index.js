const express = require("express");

const router = express.Router();

const signUpRoutes = require("./signUpRoutes.js");
const itineraryRoutes = require("./itineraryRoutes.js");
const activityRoutes = require("./activityRoutes.js");
const categoryRoutes = require("./categoryRoutes.js");

router.use("/signUp", signUpRoutes);
router.use("/itinerary", itineraryRoutes);
router.use("/activity", activityRoutes);
router.use("/category",categoryRoutes);