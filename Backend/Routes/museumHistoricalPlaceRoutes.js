const express = require("express");
const museumHistoricalPlace = require("../Controllers/MuseumAndHistoricalPlace/museumHistoricalPlaceController.js")
const { addMuseumHistoricalPlace, getMuseumHistoricalPlace, getAllMuseumHistoricalPlace, updateMuseumHistoricalPlace, deleteMuseumHistoricalPlace, getAllUpcomingMuseumHistoricalPlace, searchMuseumHistoricalPlace, createTags, filterByTags } = require("../Controllers/MuseumAndHistoricalPlace/museumHistoricalPlaceController.js")
//must import all needed ftns here
const router = express.Router(); //creates an instance of the Router which is inside the Express library
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Or configure storage options
router.post("/addMuseumHistoricalPlace", upload.array('pictures', 10), addMuseumHistoricalPlace); // 'pictures' should match the key used in FormData


//router.post("/addMuseumHistoricalPlace", addMuseumHistoricalPlace);
router.get("/getMuseumHistoricalPlace/:id", getMuseumHistoricalPlace);
router.get("/getAllMuseumHistoricalPlace/:createdBy", getAllMuseumHistoricalPlace);
router.put("/updateMuseumHistoricalPlace/:id", updateMuseumHistoricalPlace);
router.delete("/deleteMuseumHistoricalPlace/:id", deleteMuseumHistoricalPlace);
router.get("/getAllUpcomingMuseumHistoricalPlace", getAllUpcomingMuseumHistoricalPlace);
router.get("/searchMuseumHistoricalPlace", searchMuseumHistoricalPlace);
router.patch('/createTags/:id', createTags);
router.get('/filterByTags', filterByTags);

module.exports = router;