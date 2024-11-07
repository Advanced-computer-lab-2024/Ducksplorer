const express = require("express");
const {getProducts,findProduct,filterProducts,sortProducts}= require('../Controllers/Products/TAScontroller');
const { receiveLoyaltyPoints, redeemPoints, createBooking, getMyBookings, cancelMyBooking, viewMyUpcomingBookings, viewMyPastBookings, viewDesiredActivity, viewDesiredItinerary, getLevel } = require("../Controllers/bookingController");

const router = express.Router();

router.get("/getproducts",getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts",sortProducts);
router.get("/filterProducts",filterProducts);
router.patch("/loyalty/:price/:userName",receiveLoyaltyPoints);
router.patch("/redeemPoints/:userName", redeemPoints);
router.get("/myPastBookings/:user", viewMyPastBookings);
router.get("/getLevel/:userName", getLevel);
router.route("/booking/:user").post(createBooking).get(getMyBookings).patch(cancelMyBooking);
router.route("/myUpcomingBookings").get(viewMyUpcomingBookings);
router.route("/viewDesiredActivity/:activityId").get(viewDesiredActivity);
router.route("/viewDesiredItinerary/:itineraryId").get(viewDesiredItinerary);


module.exports = router;




