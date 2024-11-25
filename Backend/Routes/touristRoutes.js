const express = require("express");
const {
  getProducts,
  findProduct,
  filterProducts,
  sortProducts,
  touristUpdateProductRating,
  getProductRating,
  touristUpdateProductReview
} = require("../Controllers/Products/TAScontroller");

const {
  getMyPurchases,
  updatePurchase,
} = require("../Controllers/purchasesController");

const { createBooking, viewMyUpcomingBookings, viewMyPastBookings, viewDesiredActivity, viewDesiredItinerary, getMyBookings, cancelMyBooking, receiveLoyaltyPoints, getLevel, updateLevel,
  redeemPoints, payVisa, payWallet } = require("../Controllers/bookingController");
  
const {addProductToCart,removeProductFromCart,updateProductQuantity,viewCart,addPurchase} = require("../Controllers/Products/cartController");
const router = express.Router();

router.get("/getproducts", getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts",  sortProducts);
router.get("/filterProducts",  filterProducts);
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


//view cart
router.get("/myCart",viewCart);
//add to cart
router.put("/cart",addProductToCart);
//remove from cart
router.delete("/cart",removeProductFromCart);
//edit the product quantity in the product
router.patch("/cart",updateProductQuantity);
//add purchases from cart
router.put("/addPurchase",addPurchase);

//router.patch("/loyalty/:name/:userName",receiveLoyaltyPoints);
router.get("/myPurchases/:buyer", getMyPurchases);
router.put("/updatePurchases/:buyer", updatePurchase);
router.put("/updateProducts/:id", touristUpdateProductRating);
router.get("/getRating/:id/rating/:buyer", getProductRating);
router.put("/addReview/:id", touristUpdateProductReview);

module.exports = router;