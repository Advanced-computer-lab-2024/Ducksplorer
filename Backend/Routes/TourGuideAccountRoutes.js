const express = require("express");
const { getTourGuideDetails, updateTourGuideDetails, removeFileUrl, deleteMyTourGuideAccount } = require("../Controllers/tourGuideAccount.js");
const { viewMyItineraries, filterMyItineraries } = require("../Controllers/Reports/tourGuideReport.js")

const router = express.Router();

router.get("/viewaccount/:userName", getTourGuideDetails);//done

router.get("/report/:tourGuideName", viewMyItineraries);//done

router.get("/filterReport/:tourGuideName", filterMyItineraries);//done

router.put("/editaccount", updateTourGuideDetails);//done but not tested

router.post('/removeFileUrl', removeFileUrl);//done but not tested

router.delete("/deleteMyTourGuideAccount/:userName", deleteMyTourGuideAccount);//done

module.exports = router;