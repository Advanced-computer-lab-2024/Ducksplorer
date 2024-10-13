const express = require("express");
const {getProducts,findProduct,filterProducts,sortProducts}= require('../Controllers/Products/TAScontroller');
const { receiveLoyaltyPoints, redeemPoints, createBooking, getMyBookings, cancelMyBooking } = require("../Controllers/bookingController");

const router = express.Router();

router.get("/getproducts",getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts",sortProducts);
router.get("/filterProducts",filterProducts);
router.patch("/loyalty/:name/:userName",receiveLoyaltyPoints);
router.patch("/redeemPoints/:userName", redeemPoints);
router.route("/booking/:user").post(createBooking).get(getMyBookings).delete(cancelMyBooking);




module.exports = router;




