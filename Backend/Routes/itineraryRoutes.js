const express = require('express')
const { getAllItineraries, getItinerary, updateItinerary, deleteItinerary, createItinerary } = require('../Controllers/itineraryController');
const router = express.Router();

router.route("/").post(createItinerary).get(getAllItineraries)
router.route("/:id").get(getItinerary).put(updateItinerary).delete(deleteItinerary)