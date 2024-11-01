const express = require('express')
const { rateTourGuide } = require('../Controllers/tourGuideRateController')
const router = express.Router();


router.route("/rate/:tourGuideId").patch(rateTourGuide);

module.exports = router