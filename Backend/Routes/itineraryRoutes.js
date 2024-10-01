const express = require('express')
const { getAllItineraries, getItinerary, updateItinerary, deleteItinerary, createItinerary } = require('../Controllers/Itinerary/itineraryCRUDController');
const { sortItineraries } = require('../Controllers/Itinerary/itinerarySortController');
const { filterItineraries } = require('../Controllers/Itinerary/itineraryFilterController');
const { getUpcomingItineraries } = require('../Controllers/Itinerary/itineraryViewUpcomingController');
const { searchItineraries } = require('../Controllers/Itinerary/itinerarySearchController');
const router = express.Router();

router.route("/").post(createItinerary).get(getAllItineraries)
router.route("/sort").get(sortItineraries)
//pass as /sort?sortBy=price OR /sort?sortBy=rating
// or /sort?sortBy=price&sortOrder=desc and if i dont specify order then default is ascending 

router.route("/filter").get(filterItineraries)

router.route("/search").get(searchItineraries)

router.route("/upcoming").get(getUpcomingItineraries)

router.route("/:id").get(getItinerary).put(updateItinerary).delete(deleteItinerary)

module.exports = router
