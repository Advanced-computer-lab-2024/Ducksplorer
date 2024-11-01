const express = require("express");
const { getTourGuideDetails, updateTourGuideDetails, deleteTourGuide } = require("../Controllers/tourGuideAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getTourGuideDetails);

router.put("/editaccount", updateTourGuideDetails);

router.delete("/deleteTourGuide/:userName", deleteTourGuide);


module.exports = router;