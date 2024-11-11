const express = require("express");
const { getTouristDetails, updateTouristDetails, deleteMyTouristAccount , getTouristPreferences, getFavoriteCategory } = require("../Controllers/touristAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getTouristDetails);

router.put("/editaccount", updateTouristDetails);

router.delete("/deleteMyTouristAccount/:userName", deleteMyTouristAccount);

router.delete("/deleteMyTouristAccount/:userName", deleteMyTouristAccount);

router.get("/preferences/:userName", getTouristPreferences);

router.get("/favoriteCategory/:userName", getFavoriteCategory);

module.exports = router;