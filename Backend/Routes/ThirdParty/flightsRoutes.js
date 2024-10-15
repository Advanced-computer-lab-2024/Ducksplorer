const express = require("express");

const router = express.Router();

const  {getCityCode , getFlights}  = require("../../Controllers/ThirdParty/flights.js");

router.get(`/city-and-airport-search/:city`, getCityCode);
router.get("/flight-search", getFlights);

module.exports = router;