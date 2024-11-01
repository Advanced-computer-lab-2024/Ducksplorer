const express = require("express");
const { getTouristDetails, updateTouristDetails,deleteTourist } = require("../Controllers/touristAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getTouristDetails);

router.put("/editaccount", updateTouristDetails);

router.delete("/deleteTourist/:userName", deleteTourist);

module.exports = router;