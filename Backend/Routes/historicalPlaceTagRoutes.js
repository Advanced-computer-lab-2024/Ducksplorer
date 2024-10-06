const express = require("express");
const { addHistoricalPlaceTag,getAllHistoricalPlaceTags} = require("../Controllers/MuseumAndHistoricalPlace/historicalPlaceTagController.js")
//must import all needed ftns here
const router = express.Router(); //creates an instance of the Router which is inside the Express library



router.post("/addHistoricalPlaceTag", addHistoricalPlaceTag);
router.get("/getAllHistoricalPlaceTags", getAllHistoricalPlaceTags);

module.exports = router;