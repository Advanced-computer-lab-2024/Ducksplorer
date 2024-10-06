const express = require("express");
const { addHistoricalPlace, getHistoricalPlace, getAllMyHistoricalPlaces,getAllHistoricalPlaces, updateHistoricalPlace, deleteHistoricalPlace, getAllUpcomingHistoricalPlaces, searchHistoricalPlace, createTags, filterByTags } = require("../Controllers/MuseumAndHistoricalPlace/historicalPlaceController.js")
//must import all needed ftns here
const router = express.Router(); //creates an instance of the Router which is inside the Express library
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Or configure storage options



router.post("/addHistoricalPlace", upload.array('pictures', 10), addHistoricalPlace); // 'pictures' should match the key used in FormData

//router.post("/addMuseumHistoricalPlace", addMuseumHistoricalPlace);
router.get("/getHistoricalPlace/:id", getHistoricalPlace);
router.get("/getAllMyHistoricalPlaces/:userName", getAllMyHistoricalPlaces);
router.get("/getAllHistoricalPlaces", getAllHistoricalPlaces);
router.put("/updateHistoricalPlace/:id", updateHistoricalPlace);
router.delete("/deleteHistoricalPlace/:id", deleteHistoricalPlace);
router.get("/getAllUpcomingHistoricalPlaces", getAllUpcomingHistoricalPlaces);
router.get("/searchHistoricalPlace", searchHistoricalPlace);
router.patch('/createTags/:id', createTags);
router.get('/filterByTags', filterByTags);

module.exports = router;