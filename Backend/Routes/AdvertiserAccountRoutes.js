const express = require("express");
const { getAdvertiserDetails, updateAdvertiserDetails,deleteMyAdvertiserAccount } = require("../Controllers/advertiserAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getAdvertiserDetails);

router.put("/editaccount", updateAdvertiserDetails);

router.delete("/deleteMyAdvertiserAccount/:userName", deleteMyAdvertiserAccount);


module.exports = router;