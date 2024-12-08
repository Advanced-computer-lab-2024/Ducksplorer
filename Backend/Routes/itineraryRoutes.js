const express = require("express");
const {
  getAllItineraries,
  getItinerary,
  updateItinerary,
  deleteOnlyNotBookedItinerary,
  createItinerary,
  toggleFlagItinerary,
  deletePastItineraries,
  remindUpcomingItineraries,
} = require("../Controllers/Itinerary/itineraryCRUDController");
const {
  sortItineraries,
} = require("../Controllers/Itinerary/itinerarySortController");
const {
  filterItineraries,
  filterUpcomingItineraries,
} = require("../Controllers/Itinerary/itineraryFilterController");
const {
  getUpcomingItineraries,
} = require("../Controllers/Itinerary/itineraryViewUpcomingController");
const {
  searchItineraries,
} = require("../Controllers/Itinerary/itinerarySearchController");
const {
  getAllMyItineraries,
} = require("../Controllers/Itinerary/itineraryGetMyController");
const {
  rateItinerary,
} = require("../Controllers/Itinerary/itineraryRateController");
const {
  toggleItineraryActiveStatus,
} = require("../Controllers/Itinerary/itineraryDeactivateController");
const {
  commentItinerary,
} = require("../Controllers/Itinerary/itineraryCommentController");
const {
  touristSaveItinerary,
  getSaveState,
} = require("../Controllers/Itinerary/itinerarySaveController");

const router = express.Router();

router.route("/").post(createItinerary).get(getAllItineraries);
router.route("/sort").get(sortItineraries);
//pass as /sort?sortBy=price OR /sort?sortBy=rating
// or /sort?sortBy=price&sortOrder=desc and if i dont specify order then default is ascending

router.route("/filter").get(filterItineraries);

router.route("/deletePast").delete(deletePastItineraries);

router.route("/search").get(searchItineraries);

router.route("/upcoming").get(getUpcomingItineraries);

router.route("/filterUpcoming").get(filterUpcomingItineraries);

router.route("/myItineraries/:userName").get(getAllMyItineraries);

router
  .route("/:id")
  .get(getItinerary)
  .put(updateItinerary)
  .delete(deleteOnlyNotBookedItinerary);

router.post("/reminder", remindUpcomingItineraries);//done but not tested

router.route("/toggleFlagItinerary/:id").put(toggleFlagItinerary);//done but not tested

router.route("/rateItinerary/:bookingId").patch(rateItinerary);//done but not tested

router
  .route("/toggleItineraryActiveStatus/:id")
  .put(toggleItineraryActiveStatus);//done but not tested

router.route("/commentItinerary/:bookingId").patch(commentItinerary);//done but not tested

router.route("/save/:id").put(touristSaveItinerary);//done but not tested

router.route("/getSave/:id/:username").get(getSaveState);//done but not tested

module.exports = router;
