const express = require("express");
const {
  getProducts,
  findProduct,
  filterProducts,
  sortProducts,
  touristUpdateProductRating,
  getProductRating,
  touristUpdateProductReview,
} = require("../Controllers/Products/TAScontroller");

const {
  getMyPurchases,
  updatePurchase,
  getGroupedPurchases,
  getPurchasesByOrderNumber,
  getOrderProducts,
  cancelOrder,
  // getMyOrder,
} = require("../Controllers/purchasesController");

const {
  getMyWishlist,
  updateWishlist,
  removeFromWishlist,
} = require("../Controllers/wishlistController");

const {
  placeOrder,
  removeProductFromOrder,
  getOrdersByUsername,
} = require("../Controllers/orderController");

const {
  createBooking,
  viewMyUpcomingBookings,
  viewDesiredActivity,
  viewDesiredItinerary,
  getMyBookings,
  cancelMyBooking,
  receiveLoyaltyPoints,
  getLevel,
  updateLevel,
  redeemPoints,
  payVisa,
  payWallet,
  getWalletBalance,
  viewMyPastBookings,
} = require("../Controllers/bookingController");

const {
  addProductToCart,
  removeProductFromCart,
  updateProductQuantity,
  viewCart,
  addPurchase2,
  getMyOrders,
  getAddresses,
  addAddress,
  emptyCart,
} = require("../Controllers/Products/cartController");

const { validatePromoCode } = require("../Controllers/promoCodeController");
const { bod } = require("../Controllers/touristAccount");
const router = express.Router();

router.get("/getproducts", getProducts); //done
router.get("/findProduct", findProduct); //done
router.put("/sortProducts", sortProducts); //done
router.get("/filterProducts", filterProducts); //done
router.patch("/loyalty/:price/:userName", receiveLoyaltyPoints); //done but not tested
router.patch("/redeemPoints/:userName", redeemPoints); //done but not tested
router.get("/myPastBookings", viewMyPastBookings); //done
router.get("/getLevel/:userName", getLevel); //done
router.route("/booking").get(getMyBookings); //done
router.route("/booking/:user").post(createBooking).patch(cancelMyBooking); //done but not tested
router.route("/myUpcomingBookings").get(viewMyUpcomingBookings); //done
router.route("/viewDesiredActivity/:activityId/:user").get(viewDesiredActivity); //done
router
  .route("/viewDesiredItinerary/:itineraryId/:user")
  .get(viewDesiredItinerary); //done
router.patch("/payWallet/:userName", payWallet); //done but not tested
router.patch("/payVisa/:userName", payVisa); //done but not tested
router.get("/balance/:userName", getWalletBalance); //done

//view cart
router.get("/myCart/:userName", viewCart); //done
//add to cart
router.put("/cart", addProductToCart); //done but not tested
//remove from cart
router.delete("/cart", removeProductFromCart); //done but not tested
//edit the product quantity in the product
router.patch("/cart", updateProductQuantity); //done but not tested
//add purchases from cart
router.put("/addPurchase", addPurchase2); //done but not tested

router.delete("/emptyCart", emptyCart); //done but not tested

//router.patch("/loyalty/:name/:userName",receiveLoyaltyPoints);
router.get("/myPurchases/:buyer", getMyPurchases); //done
// router.get("/myOrder", getMyOrder);
router.get("/groupedPurchases/:buyer", getGroupedPurchases); //done
router.get("/orderDetails/:orderNumber", getPurchasesByOrderNumber); //done
router.get("/getOrderProducts/:productId", getOrderProducts); //done
router.delete("/cancelOrder/:username/:orderNumber", cancelOrder); //done but not tested

router.get("/myOrders/:buyer", getMyOrders);

router.put("/updatePurchases/:buyer", updatePurchase); //done but not tested
router.put("/updateProducts/:id", touristUpdateProductRating); //done but not tested
router.get("/getRating/:id/rating/:buyer", getProductRating); //done
router.put("/addReview/:id", touristUpdateProductReview); //done but not tested

router.get("/myWishlist/:username", getMyWishlist); //done
router.put("/updateWishlist/:username", updateWishlist); //done but not tested
router.put("/removeFromWishlist/:username/:productId", removeFromWishlist); // done but not tested

router.post("/validCode", validatePromoCode); //done but not tested

router.get("/addresses/:userName", getAddresses); //done
router.post("/newAddress/:userName", addAddress); //done but not tested

module.exports = router;
