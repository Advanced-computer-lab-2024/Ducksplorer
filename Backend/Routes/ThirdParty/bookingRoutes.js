const express = require("express");

const router = express.Router();

const  {getCityCode , getFlights, touristBooking}  = require("../../Controllers/ThirdParty/bookings.js");

router.get(`/city-and-airport-search/:city`, getCityCode);
router.get("/flight-search", getFlights);

router.put("/tourist-booking", touristBooking);

module.exports = router;