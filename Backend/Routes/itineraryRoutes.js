const express = require('express')
const { getAllItineraries, getItinerary, updateItinerary, deleteItinerary, createItinerary } = require('../Controllers/Itinerary/itineraryCRUDController');
const { sortItineraries } = require('../Controllers/Itinerary/itinerarySortController');
const router = express.Router();

router.route("/").post(createItinerary).get(getAllItineraries)
router.route("/sort").get(sortItineraries)
//pass as /sort?sortBy=price OR /sort?sortBy=rating
router.route("/:id").get(getItinerary).put(updateItinerary).delete(deleteItinerary)

module.exports = router
