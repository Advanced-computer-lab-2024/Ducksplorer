const express = require("express");
const { getTourGuideDetails, updateTourGuideDetails,removeFileUrl, deleteMyTourGuideAccount } = require("../Controllers/tourGuideAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getTourGuideDetails);

router.put("/editaccount", updateTourGuideDetails);

router.post('/removeFileUrl', removeFileUrl);

router.delete("/deleteMyTourGuideAccount/:userName", deleteMyTourGuideAccount);


module.exports = router;