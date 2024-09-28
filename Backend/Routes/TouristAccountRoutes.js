const express = require("express");
const { getTouristDetails, updateTouristDetails } = require("../Controllers/touristAccount.js");

const router = express.Router();

router.get("/viewaccount", getTouristDetails);

router.put("/editaccount", updateTouristDetails);

module.exports = router;