const express = require('express')
const { getAllItineraries, getItinerary, updateItinerary, updateChosenDateItinerary, deleteItinerary, createItinerary, toggleFlagItinerary } = require('../Controllers/Itinerary/itineraryCRUDController');
const { sortItineraries } = require('../Controllers/Itinerary/itinerarySortController');
const { filterItineraries, filterUpcomingItineraries } = require('../Controllers/Itinerary/itineraryFilterController');
const { getUpcomingItineraries } = require('../Controllers/Itinerary/itineraryViewUpcomingController');
const { searchItineraries } = require('../Controllers/Itinerary/itinerarySearchController');
const { getAllMyItineraries } = require('../Controllers/Itinerary/itineraryGetMyController');
const { rateItinerary } = require('../Controllers/Itinerary/itineraryRateController');
const { toggleActiveFlagItinerary } = require('../Controllers/Itinerary/itineraryFlagsController')
const { commentItinerary } = require('../Controllers/Itinerary/itineraryCommentController');
const { deleteOnlyNotBookedItinerary } = require('../Controllers/Itinerary/itineraryDeleteOnlyNotBookedController');

const router = express.Router();

router.route("/").post(createItinerary).get(getAllItineraries)
router.route("/sort").get(sortItineraries)
//pass as /sort?sortBy=price OR /sort?sortBy=rating
// or /sort?sortBy=price&sortOrder=desc and if i dont specify order then default is ascending 

router.route("/filter").get(filterItineraries)

router.route("/search").get(searchItineraries)

router.route("/upcoming").get(getUpcomingItineraries)

router.route("/filterUpcoming").get(filterUpcomingItineraries)

router.route("/myItineraries/:userName").get(getAllMyItineraries)

router.route("/:id").get(getItinerary).put(updateItinerary).delete(deleteItinerary)

router.route("/updateDate/:id").put(updateChosenDateItinerary)

router.route("/toggleFlagItinerary/:id").put(toggleFlagItinerary)

router.route("/rateItinerary/:itineraryId").patch(rateItinerary)

router.route("/toggleActiveFlagItinerary/:id").put(toggleActiveFlagItinerary)

router.route("/commentItinerary/:itineraryId").patch(commentItinerary)

router.route("/deleteOnlyNotBookedItinerary/:id").delete(deleteOnlyNotBookedItinerary)

module.exports = router
