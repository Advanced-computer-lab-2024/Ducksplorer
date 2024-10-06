const express = require("express");
const { addMuseum, getMuseum, getAllMyMuseums,getAllMuseums, updateMuseum, deleteMuseum, getAllUpcomingMuseums, searchMuseum, filterByTags } = require("../Controllers/MuseumAndHistoricalPlace/museumController.js")
//must import all needed ftns here
const router = express.Router(); //creates an instance of the Router which is inside the Express library
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Or configure storage options

router.post("/addMuseum", upload.array('pictures', 10), addMuseum); // 'pictures' should match the key used in FormData


//router.post("/addMuseumHistoricalPlace", addMuseumHistoricalPlace);
router.get("/getMuseum/:id", getMuseum);
router.get("/getAllMyMuseums/:createdBy", getAllMyMuseums);
router.get("/getAllMuseums", getAllMuseums);
router.put("/updateMuseum/:id", updateMuseum);
router.delete("/deleteMuseum/:id", deleteMuseum);
router.get("/getAllUpcomingMuseums", getAllUpcomingMuseums);
router.get("/searchMuseum", searchMuseum);
router.get('/filterByTags', filterByTags);

module.exports = router;