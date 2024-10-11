const express = require("express");
//must import all needed ftns here:
const { addHistoricalPlace, getHistoricalPlace, getAllMyHistoricalPlaces,getAllHistoricalPlaces, updateHistoricalPlace, deleteHistoricalPlace, getAllUpcomingHistoricalPlaces, searchHistoricalPlace, filterByTags } = require("../../Controllers/MuseumAndHistoricalPlace/historicalPlaceController.js")
const router = express.Router(); //creates an instance of the Router which is inside the Express library

//use this for file uploads
// const multer = require('multer'); //used for choose files not needed anymore
// const upload = multer({ dest: 'uploads/' }); // Or configure storage options
// router.post("/addHistoricalPlace", upload.array('pictures', 10), addHistoricalPlace); // 'pictures' should match the key used in FormData

router.post("/addHistoricalPlace", addHistoricalPlace);
router.get("/getHistoricalPlace/:id", getHistoricalPlace);
router.get("/getAllMyHistoricalPlaces/:userName", getAllMyHistoricalPlaces);
router.get("/getAllHistoricalPlaces", getAllHistoricalPlaces);
router.put("/updateHistoricalPlace/:id", updateHistoricalPlace);
router.delete("/deleteHistoricalPlace/:id", deleteHistoricalPlace);
router.get("/getAllUpcomingHistoricalPlaces", getAllUpcomingHistoricalPlaces);
router.get("/searchHistoricalPlace", searchHistoricalPlace);
//router.patch('/createTags/:id', createTags);
router.get('/filterByTags', filterByTags);

module.exports = router;