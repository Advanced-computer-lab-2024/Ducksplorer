const express = require("express");
const { getAdvertiserDetails, updateAdvertiserDetails,deleteMyAdvertiserAccount ,removeFileUrl} = require("../Controllers/advertiserAccount.js");
const { viewMyActivities, filterMyActivities } = require('../Controllers/Reports/advertiserReport.js');

const router = express.Router();

router.get("/viewaccount/:userName", getAdvertiserDetails); //done

router.put("/editaccount", updateAdvertiserDetails); //done without body

router.post('/removeFileUrl', removeFileUrl); //done without body

router.delete("/deleteMyAdvertiserAccount/:userName", deleteMyAdvertiserAccount);//done

router.route("/report/:advertiserName").get(viewMyActivities); //done

router.route("/filterReport/:advertiserName").get(filterMyActivities);//done

module.exports = router;