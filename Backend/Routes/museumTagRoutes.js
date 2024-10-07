const express = require("express");
const { addMuseumTag,getAllMuseumTags} = require("../Controllers/MuseumAndHistoricalPlace/museumTagController.js")
//must import all needed ftns here
const router = express.Router(); //creates an instance of the Router which is inside the Express library



router.post("/addMuseumTag", addMuseumTag);
router.get("/getAllMuseumTags", getAllMuseumTags);

module.exports = router;