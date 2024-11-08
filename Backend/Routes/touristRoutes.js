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

const router = express.Router();

router.get("/getproducts", getProducts);
router.get("/findProduct", findProduct);
router.put("/sortProducts", sortProducts);
router.get("/filterProducts", filterProducts);
router.get("/myPurchases/:buyer", getMyPurchases);
router.put("/updatePurchases/:buyer", updatePurchase);
router.put("/updateProducts/:id", touristUpdateProductRating);
router.get("/getRating/:id/rating/:buyer", getProductRating);
router.put("/addReview/:id", touristUpdateProductReview);

module.exports = router;
