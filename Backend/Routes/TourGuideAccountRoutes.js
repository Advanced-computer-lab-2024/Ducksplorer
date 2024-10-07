const express = require("express");
const { getTourGuideDetails, updateTourGuideDetails } = require("../Controllers/tourGuideAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getTourGuideDetails);

router.put("/editaccount", updateTourGuideDetails);

module.exports = router;