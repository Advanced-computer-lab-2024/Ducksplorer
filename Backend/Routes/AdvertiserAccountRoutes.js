const express = require("express");
const { getAdvertiserDetails, updateAdvertiserDetails,deleteMyAdvertiserAccount ,removeFileUrl} = require("../Controllers/advertiserAccount.js");
const { viewMyActivities, filterMyActivities } = require('../Controllers/Reports/advertiserReport.js');

const router = express.Router();

router.get("/viewaccount/:userName", getAdvertiserDetails);

router.put("/editaccount", updateAdvertiserDetails);
router.post('/removeFileUrl', removeFileUrl);

router.delete("/deleteMyAdvertiserAccount/:userName", deleteMyAdvertiserAccount);

router.route("/report/:advertiserName").get(viewMyActivities);
router.route("/filterReport/:advertiserName").get(filterMyActivities);

module.exports = router;