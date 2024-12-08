const express = require("express");
//must import all needed ftns here:
const { addHistoricalPlace, getHistoricalPlace, getAllMyHistoricalPlaces,getAllHistoricalPlaces, updateHistoricalPlace, deleteHistoricalPlace, getAllUpcomingHistoricalPlaces, searchHistoricalPlace, filterByTags } = require("../../Controllers/MuseumAndHistoricalPlace/historicalPlaceController.js")
const router = express.Router(); //creates an instance of the Router which is inside the Express library

//use this for file uploads
// const multer = require('multer'); //used for choose files not needed anymore
// const upload = multer({ dest: 'uploads/' }); // Or configure storage options
// router.post("/addHistoricalPlace", upload.array('pictures', 10), addHistoricalPlace); // 'pictures' should match the key used in FormData

router.post("/addHistoricalPlace", addHistoricalPlace); //done
router.get("/getHistoricalPlace/:id", getHistoricalPlace);//done
router.get("/getAllMyHistoricalPlaces/:userName", getAllMyHistoricalPlaces);//done
router.get("/getAllHistoricalPlaces", getAllHistoricalPlaces);//done
router.put("/updateHistoricalPlace/:id", updateHistoricalPlace);//done
router.delete("/deleteHistoricalPlace/:id", deleteHistoricalPlace);//done
router.get("/getAllUpcomingHistoricalPlaces", getAllUpcomingHistoricalPlaces);//done
router.get("/searchHistoricalPlace", searchHistoricalPlace);//done
//router.patch('/createTags/:id', createTags);
router.get('/filterByTags', filterByTags);//done

module.exports = router;