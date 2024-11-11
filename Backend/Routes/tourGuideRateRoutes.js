const express = require('express')
const { rateTourGuide, getUserNameById, getTourGuideById } = require('../Controllers/tourGuideRateController')
const router = express.Router();


router.route("/rateTourGuide/:tourGuideId").patch(rateTourGuide);
router.route("/getUserNameById/:bookingId").get(getUserNameById);
router.route("/getTourGuideById/:id").get(getTourGuideById);

module.exports = router