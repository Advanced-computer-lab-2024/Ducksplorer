const express = require("express");
const { getTouristDetails, updateTouristDetails , getTouristPreferences, getFavoriteCategory } = require("../Controllers/touristAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getTouristDetails);

router.put("/editaccount", updateTouristDetails);

router.get("/preferences/:userName", getTouristPreferences);

router.get("/favoriteCategory/:userName", getFavoriteCategory);
module.exports = router;