const express = require('express')
const { rateTourGuide } = require('../Controllers/tourGuideRateController')
const router = express.Router();


router.route("/rateTourGuide/:tourGuideId").patch(rateTourGuide);

module.exports = router