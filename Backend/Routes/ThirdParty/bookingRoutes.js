const express = require("express");

const router = express.Router();

const {
  getCityCode,
  getFlights,
  // touristBooking,
} = require("../../Controllers/ThirdParty/bookings.js");

router.get(`/city-and-airport-search/:city`, getCityCode); //done
router.post("/flight-search", getFlights);//done

// router.put("/tourist-booking", touristBooking);

module.exports = router;
