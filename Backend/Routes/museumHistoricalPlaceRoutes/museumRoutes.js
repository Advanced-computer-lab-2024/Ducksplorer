const express = require("express");
const { addMuseum, getMuseum, getAllMyMuseums,getAllMuseums, updateMuseum, deleteMuseum, getAllUpcomingMuseums, searchMuseum, filterByTags } = require("../../Controllers/MuseumAndHistoricalPlace/museumController.js")
//must import all needed ftns here:
const router = express.Router(); //creates an instance of the Router which is inside the Express library

//USE THIS IF U WANT FILE UPLOADS
// const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // Or configure storage options

// router.post("/addMuseum", upload.array('pictures', 10), addMuseum); // 'pictures' should match the key used in FormData


router.post("/addMuseum", addMuseum); //done
router.get("/getMuseum/:id", getMuseum); //done
router.get("/getAllMyMuseums/:userName", getAllMyMuseums);//done
router.get("/getAllMuseums", getAllMuseums);//done
router.put("/updateMuseum/:id", updateMuseum);//done
router.delete("/deleteMuseum/:id", deleteMuseum);//done
router.get("/getAllUpcomingMuseums", getAllUpcomingMuseums);//done
router.get("/searchMuseum", searchMuseum); //done
router.get('/filterByTags', filterByTags); //done

module.exports = router;