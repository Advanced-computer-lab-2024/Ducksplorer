const express = require("express");
const { getProducts, findProduct, filterProducts, sortProducts } = require('../Controllers/Products/TAScontroller');
const { createBooking, viewMyUpcomingBookings, viewMyPastBookings, viewDesiredActivity, viewDesiredItinerary, getMyBookings, cancelMyBooking, receiveLoyaltyPoints, getLevel, updateLevel,
    redeemPoints, payVisa, payWallet } = require("../Controllers/bookingController");
    

const router = express.Router();

router.get("/getproducts", getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts", sortProducts);
router.get("/filterProducts", filterProducts);
router.patch("/loyalty/:price/:userName", receiveLoyaltyPoints);
router.patch("/redeemPoints/:userName", redeemPoints);
router.get("/myPastBookings", viewMyPastBookings);
router.get("/getLevel/:userName", getLevel);
router.route("/booking").get(getMyBookings)
router.route("/booking/:user").post(createBooking).patch(cancelMyBooking);
router.route("/myUpcomingBookings").get(viewMyUpcomingBookings);
router.route("/viewDesiredActivity/:activityId").get(viewDesiredActivity);
router.route("/viewDesiredItinerary/:itineraryId").get(viewDesiredItinerary);
router.patch("/payWallet/:userName", payWallet);
router.patch("/payVisa/:userName", payVisa);

//router.patch("/loyalty/:name/:userName",receiveLoyaltyPoints);


module.exports = router;