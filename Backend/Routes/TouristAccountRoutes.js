const express = require("express");
const { getTouristDetails, updateTouristDetails, deleteMyTouristAccount } = require("../Controllers/touristAccount.js");

const router = express.Router();

router.get("/viewaccount/:userName", getTouristDetails);

router.put("/editaccount", updateTouristDetails);

router.delete("/deleteMyTouristAccount/:userName", deleteMyTouristAccount);

module.exports = router;