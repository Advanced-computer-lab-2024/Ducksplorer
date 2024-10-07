const express = require("express");
const { getAdvertiserDetails, updateAdvertiserDetails } = require("../Controllers/advertiserAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getAdvertiserDetails);

router.put("/editaccount", updateAdvertiserDetails);

module.exports = router;