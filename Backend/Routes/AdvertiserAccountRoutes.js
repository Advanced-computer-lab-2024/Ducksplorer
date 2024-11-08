const express = require("express");
const { getAdvertiserDetails, updateAdvertiserDetails ,removeFileUrl} = require("../Controllers/advertiserAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getAdvertiserDetails);

router.put("/editaccount", updateAdvertiserDetails);
router.post('/removeFileUrl', removeFileUrl);

module.exports = router;