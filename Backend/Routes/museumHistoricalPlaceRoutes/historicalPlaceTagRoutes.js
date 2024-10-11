// This file works with the historicalPlaceTagModel table
const express = require("express");
//must import all needed ftns here:
const { addHistoricalPlaceTag,getAllHistoricalPlaceTags} = require("../../Controllers/MuseumAndHistoricalPlace/historicalPlaceTagController.js")
const router = express.Router(); //creates an instance of the Router which is inside the Express library



router.post("/addHistoricalPlaceTag", addHistoricalPlaceTag);
router.get("/getAllHistoricalPlaceTags", getAllHistoricalPlaceTags);

module.exports = router;