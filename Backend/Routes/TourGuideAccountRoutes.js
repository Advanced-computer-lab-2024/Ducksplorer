const express = require("express");
const { getTourGuideDetails, updateTourGuideDetails, removeFileUrl, deleteMyTourGuideAccount } = require("../Controllers/tourGuideAccount.js");
const { viewMyItineraries, filterMyItineraries } = require("../Controllers/Reports/tourGuideReport.js")

const router = express.Router();

router.get("/viewaccount/:userName", getTourGuideDetails);

router.get("/report/:tourGuideName", viewMyItineraries);

router.get("/filterItReport/:tourGuideName", filterMyItineraries);

router.put("/editaccount", updateTourGuideDetails);

router.post('/removeFileUrl', removeFileUrl);

router.delete("/deleteMyTourGuideAccount/:userName", deleteMyTourGuideAccount);

module.exports = router;